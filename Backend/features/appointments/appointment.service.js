import Appointment from "./appointment.model.js";
import patient from "../patient/patient.model.js";
import Doctor from "../doctor/doctormodel.js";
import user from "../users/user.model.js";
import Department from "../departments/department.model.js";
import DoctorDepartment from "../doctordeparment/doctordepartment.model.js";

// Shared include set so every read endpoint returns the same shape:
// appointment.patient.name / appointment.doctor.name / appointment.department.name
// (see aliases in config/index.js)
const appointmentIncludes = [
  {
    model: patient,
    as: "patient",
    attributes: ["patientId", "name", "email", "phone"],
  },
  {
    model: Doctor,
    as: "doctor",
    attributes: ["id", "specialization", "consultationFee"],
    include: [
      {
        model: user,
        attributes: ["id", "name", "email"],
      },
    ],
  },
  {
    model: Department,
    as: "department",
    attributes: ["id", "name"],
  },
];

/**
 * Create an appointment REQUEST for the currently authenticated patient.
 *
 * `userId` is the authenticated user's id (req.user.id) — the Patient
 * record is looked up from it, never trusted from the request body, so a
 * patient can never create an appointment under someone else's profile.
 *
 * Per the required workflow, the patient chooses a department (not a
 * doctor) — the doctor is assigned afterwards by the receptionist.
 */
export const createAppointmentService = async (userId, data) => {
  if (!userId) {
    throw { status: 401, message: "Authenticated user is required" };
  }

  // users.id -> patients.userId -> patients.patientId (the FK appointments actually use)
  const patientRecord = await patient.findOne({ where: { userId } });

  if (!patientRecord) {
    throw {
      status: 404,
      message: "Patient not found. Please complete your patient profile before booking an appointment.",
    };
  }

  const { departmentId, appointmentDate, reason } = data;

  if (!departmentId) {
    throw { status: 400, message: "departmentId is required" };
  }
  if (!appointmentDate) {
    throw { status: 400, message: "appointmentDate is required" };
  }

  const departmentRecord = await Department.findByPk(departmentId);
  if (!departmentRecord) {
    throw { status: 404, message: `Department with ID ${departmentId} not found` };
  }

  const created = await Appointment.create({
    patientId: patientRecord.patientId,
    departmentId: departmentRecord.id,
    doctorId: null,
    appointmentDate,
    reason: reason || null,
    status: "pending",
    patientNotified: false,
  });

  return await Appointment.findByPk(created.id, { include: appointmentIncludes });
};

/**
 * Full, unfiltered appointment list — used by admin/receptionist dashboards
 * that legitimately need to see every request regardless of who it
 * belongs to.
 */
export const getAllAppointmentsService = async () => {
  return await Appointment.findAll({
    include: appointmentIncludes,
    order: [["appointmentDate", "DESC"]],
  });
};

/**
 * Appointments belonging to the authenticated patient only. Used so the
 * patient dashboard can never see anyone else's requests.
 */
export const getAppointmentsForPatientUserService = async (userId) => {
  const patientRecord = await patient.findOne({ where: { userId } });
  if (!patientRecord) return [];

  return await Appointment.findAll({
    where: { patientId: patientRecord.patientId },
    include: appointmentIncludes,
    order: [["appointmentDate", "DESC"]],
  });
};

/**
 * Appointments assigned to the authenticated doctor only. Used so a
 * doctor's dashboard only ever shows requests assigned to them — never
 * another doctor's queue.
 */
export const getAppointmentsForDoctorUserService = async (userId) => {
  const doctorRecord = await Doctor.findOne({ where: { userId } });
  if (!doctorRecord) return [];

  return await Appointment.findAll({
    where: { doctorId: doctorRecord.id },
    include: appointmentIncludes,
    order: [["appointmentDate", "DESC"]],
  });
};

export const getAppointmentByIdService = async (id) => {
  return await Appointment.findByPk(id, { include: appointmentIncludes });
};

export const updateAppointmentService = async (id, data) => {
  const existingAppointment = await Appointment.findByPk(id);

  if (!existingAppointment) {
    throw { status: 404, message: "Appointment not found" };
  }

  await existingAppointment.update(data);

  return await Appointment.findByPk(id, { include: appointmentIncludes });
};

/**
 * Receptionist (or admin) action: assign a doctor to a pending request.
 *
 *   pending -> assigned
 *
 * Validates that the doctor exists and actually belongs to the
 * department the patient requested, so a receptionist can't hand a
 * Cardiology request to a Dermatologist by mistake.
 */
export const assignDoctorService = async (id, doctorId) => {
  if (!doctorId) {
    throw { status: 400, message: "doctorId is required" };
  }

  const existingAppointment = await Appointment.findByPk(id);
  if (!existingAppointment) {
    throw { status: 404, message: "Appointment not found" };
  }

  if (existingAppointment.status !== "pending") {
    throw {
      status: 400,
      message: `Only pending appointments can be assigned a doctor (current status: ${existingAppointment.status})`,
    };
  }

  const doctorRecord = await Doctor.findByPk(doctorId);
  if (!doctorRecord) {
    throw { status: 404, message: `Doctor with ID ${doctorId} not found` };
  }

  // Make sure the doctor is actually attached to the appointment's department.
  const belongsToDepartment = await DoctorDepartment.findOne({
    where: {
      doctorId: doctorRecord.id,
      departmentId: existingAppointment.departmentId,
    },
  });
  if (!belongsToDepartment) {
    throw {
      status: 400,
      message: "Selected doctor does not belong to the requested department",
    };
  }

  existingAppointment.doctorId = doctorRecord.id;
  existingAppointment.status = "assigned";
  await existingAppointment.save();

  return await Appointment.findByPk(id, { include: appointmentIncludes });
};

/**
 * Doctor (or admin) action: approve/reject an appointment that has been
 * assigned to them.
 *
 *   assigned -> approved | rejected
 *
 * `caller` is req.user ({ id, role }). Enforced server-side (not just
 * hidden in the UI): a doctor can only decide on appointments assigned to
 * them; admins may act on any appointment.
 */
export const updateAppointmentStatusService = async (id, status, caller) => {
  const allowedStatuses = ["approved", "rejected"];

  if (!status || !allowedStatuses.includes(status)) {
    throw {
      status: 400,
      message: `status must be one of: ${allowedStatuses.join(", ")}`,
    };
  }

  const existingAppointment = await Appointment.findByPk(id);
  if (!existingAppointment) {
    throw { status: 404, message: "Appointment not found" };
  }

  if (existingAppointment.status !== "assigned") {
    throw {
      status: 400,
      message: `Only assigned appointments can be approved or rejected (current status: ${existingAppointment.status})`,
    };
  }

  if (caller?.role !== "admin") {
    const doctorRecord = await Doctor.findOne({ where: { userId: caller?.id } });
    if (!doctorRecord || doctorRecord.id !== existingAppointment.doctorId) {
      throw {
        status: 403,
        message: "You are not authorized to update this appointment",
      };
    }
  }

  existingAppointment.status = status;
  existingAppointment.patientNotified = true;
  await existingAppointment.save();

  return await Appointment.findByPk(id, { include: appointmentIncludes });
};

export const deleteAppointmentService = async (id) => {
  const existingAppointment = await Appointment.findByPk(id);

  if (!existingAppointment) {
    throw { status: 404, message: "Appointment not found" };
  }

  await existingAppointment.destroy();

  return {
    message: "Appointment deleted successfully",
  };
};
