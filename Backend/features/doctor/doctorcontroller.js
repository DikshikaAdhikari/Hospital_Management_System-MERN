import {
  createDoctorService,
  getAllDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
} from "./doctor.service.js";

// Flexible bare minimum validation function for doctor creation
const validateDoctorInput = (data) => {
  const {
    userId,
    name,
    email,
    password,
    specialization,
    qualification,
    experience,
    licenseNumber,
    consultationFee,
  } = data;

  const errors = [];

  // User identification check (must provide either userId OR name, email, password to create user)
  if (!userId) {
    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("name is required when creating a new doctor account");
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      errors.push("valid email is required when creating a new doctor account");
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      errors.push("password (minimum 6 characters) is required when creating a new doctor account");
    }
  }

  // Doctor profile fields check
  if (!specialization || typeof specialization !== "string" || !specialization.trim()) {
    errors.push("specialization is required");
  }

  if (!qualification || typeof qualification !== "string" || !qualification.trim()) {
    errors.push("qualification is required");
  }

  if (experience === undefined || experience === null || isNaN(Number(experience)) || Number(experience) < 0) {
    errors.push("experience must be a non-negative number of years");
  }

  // Accept licenseNumber as string or number
  if (licenseNumber === undefined || licenseNumber === null || !String(licenseNumber).trim()) {
    errors.push("licenseNumber is required");
  }

  if (consultationFee === undefined || consultationFee === null || isNaN(Number(consultationFee)) || Number(consultationFee) < 0) {
    errors.push("consultationFee must be a valid positive number");
  }

  return errors;
};

export const createDoctor = async (req, res) => {
  try {
    // If user is authenticated and userId is not explicitly in body, default to authenticated user's ID
    if (!req.body.userId && req.user && req.user.id) {
      req.body.userId = req.user.id;
    }

    // Perform bare minimum validation directly inside the controller
    const validationErrors = validateDoctorInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const doctor = await createDoctorService(req.body);

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to create doctor",
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctorsService();

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to retrieve doctors",
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await getDoctorByIdService(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to retrieve doctor",
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await updateDoctorService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update doctor",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await deleteDoctorService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete doctor",
    });
  }
};