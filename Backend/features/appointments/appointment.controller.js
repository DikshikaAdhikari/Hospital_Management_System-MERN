import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentsForPatientUserService,
  getAppointmentsForDoctorUserService,
  getAppointmentByIdService,
  updateAppointmentService,
  assignDoctorService,
  updateAppointmentStatusService,
  deleteAppointmentService,
} from "./appointment.service.js";

// Create Appointment
// Only the authenticated user's own patient profile (looked up server-side
// from req.user.id) is ever used — patientId is never taken from req.body,
// so it can't be spoofed and a missing profile can't silently create one.
export const createAppointment = async (req, res) => {
  try {
    const appointment = await createAppointmentService(req.user?.id, req.body);

    res.status(201).json({
      success: true,
      message: "Appointment request created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create appointment",
    });
  }
};

// Get Appointments
// Scoped by role so nobody sees more than they should, regardless of what
// the frontend requests:
//   - patient      -> only their own appointments
//   - doctor       -> only appointments assigned to them
//   - receptionist/admin -> every appointment (needed to triage requests)
export const getAllAppointments = async (req, res) => {
  try {
    const { id: userId, role } = req.user || {};
    let appointments;

    if (role === "patient") {
      appointments = await getAppointmentsForPatientUserService(userId);
    } else if (role === "doctor") {
      appointments = await getAppointmentsForDoctorUserService(userId);
    } else {
      appointments = await getAllAppointmentsService();
    }

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    // Log the full Sequelize error server-side so association/alias issues
    // are actually visible instead of only surfacing as a bare 500.
    console.error("GET ALL APPOINTMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve appointments",
    });
  }
};

// Get Appointment By ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("GET APPOINTMENT BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Appointment (full update) — admin only, see routes file.
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await updateAppointmentService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT ERROR:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assign Doctor (receptionist/admin action)
// PUT /api/appointments/:id/assign  { "doctorId": "..." }
// pending -> assigned
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const appointment = await assignDoctorService(req.params.id, doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor assigned successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("ASSIGN DOCTOR ERROR:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve/Reject Appointment (assigned doctor, or admin, only)
// PUT /api/appointments/:id/status  { "status": "approved" | "rejected" }
// assigned -> approved | rejected
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await updateAppointmentStatusService(
      req.params.id,
      status,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT STATUS ERROR:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const result = await deleteAppointmentService(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("DELETE APPOINTMENT ERROR:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
