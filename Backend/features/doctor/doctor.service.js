import Doctor from "./doctormodel.js";
import user from "../users/user.model.js";
import Department from "../departments/department.model.js";
import bcrypt from "bcrypt";

// Shared include set: user (name/email) + departments (via the
// DoctorDepartment join table, alias "departments" defined in config/index.js).
const doctorIncludes = [
  {
    model: user,
    attributes: ["id", "name", "email", "roles"],
  },
  {
    model: Department,
    as: "departments",
    attributes: ["id", "name"],
    through: { attributes: [] }, // don't leak the raw join-table row
  },
];

// Create Doctor
export const createDoctorService = async (doctorData) => {
  let userId = doctorData.userId;

  // If userId is not provided, create a user account for the doctor
  if (!userId && doctorData.email && doctorData.password && doctorData.name) {
    const existingUser = await user.findOne({
      where: { email: doctorData.email.toLowerCase() },
    });

    if (existingUser) {
      throw {
        status: 400,
        message: "User with this email already exists",
      };
    }

    const hashedPassword = bcrypt.hashSync(doctorData.password, 10);
    const newUser = await user.create({
      name: doctorData.name,
      email: doctorData.email.toLowerCase(),
      password: hashedPassword,
      roles: "doctor",
    });

    userId = newUser.id;
  } else if (userId) {
    // Validate existing user
    const existingUser = await user.findByPk(userId);
    if (!existingUser) {
      throw {
        status: 404,
        message: `User with ID ${userId} not found`,
      };
    }

    // Ensure user role is updated to doctor if not already
    if (existingUser.roles !== "doctor") {
      await existingUser.update({ roles: "doctor" });
    }
  } else {
    throw {
      status: 400,
      message: "Provide either a valid userId or doctor user details (name, email, password)",
    };
  }

  // Check if doctor profile already exists for this user
  const existingDoctor = await Doctor.findOne({ where: { userId } });
  if (existingDoctor) {
    throw {
      status: 400,
      message: "Doctor profile already exists for this user",
    };
  }

  const licenseStr = String(doctorData.licenseNumber);

  // Check unique license number
  const existingLicense = await Doctor.findOne({
    where: { licenseNumber: licenseStr },
  });
  if (existingLicense) {
    throw {
      status: 400,
      message: "Doctor with this license number already exists",
    };
  }

  const newDoctor = await Doctor.create({
    userId,
    specialization: doctorData.specialization,
    qualification: doctorData.qualification,
    experience: Number(doctorData.experience),
    licenseNumber: licenseStr,
    consultationFee: Number(doctorData.consultationFee),
    status: doctorData.status || "active",
  });

  // Fetch created doctor with associated user + department details
  const createdDoctor = await Doctor.findByPk(newDoctor.id, {
    include: doctorIncludes,
  });

  return createdDoctor;
};

// Get All Doctors
export const getAllDoctorsService = async () => {
  return await Doctor.findAll({
    include: doctorIncludes,
  });
};

// Get Doctor By ID
export const getDoctorByIdService = async (id) => {
  return await Doctor.findByPk(id, {
    include: doctorIncludes,
  });
};

// Update Doctor
export const updateDoctorService = async (id, doctorData) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw { status: 404, message: "Doctor not found" };
  }
  await doctor.update(doctorData);
  return doctor;
};

// Delete Doctor
export const deleteDoctorService = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw { status: 404, message: "Doctor not found" };
  }
  await doctor.destroy();
  return doctor;
};