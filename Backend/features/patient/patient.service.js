import patient from "./patient.model.js";
import user from "../users/user.model.js";
import Doctor from "../doctor/doctormodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * ============================================================
 * CREATE / REGISTER PATIENT
 * ============================================================
 */
export const createPatientService = async (patientData) => {
  let userId = patientData.userId;
  let accessToken = null;
  let refreshToken = null;

  // Auto-create user account if credentials are provided
  if (!userId && patientData.email && patientData.password && patientData.name) {
    const existingUser = await user.findOne({
      where: {
        email: patientData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw {
        status: 400,
        message: "User with this email already exists",
      };
    }

    const hashedPassword = bcrypt.hashSync(patientData.password, 10);

    const newUser = await user.create({
      name: patientData.name,
      email: patientData.email.toLowerCase(),
      password: hashedPassword,
      roles: "patient",
    });

    userId = newUser.id;

    // Access token
    accessToken = jwt.sign(
      {
        id: newUser.id,
        role: newUser.roles,
      },
      process.env.JWT_Access_SECRET || process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_Access_EXPIRES_IN || "3650d",
      }
    );

    // Refresh token
    refreshToken = jwt.sign(
      {
        id: newUser.id,
        role: newUser.roles,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn:
          process.env.JWT_REFRESH_EXPIRES_IN || "3650d",
      }
    );
  } else if (userId) {
    const existingUser = await user.findByPk(userId);

    if (!existingUser) {
      throw {
        status: 404,
        message: `User with ID ${userId} not found`,
      };
    }
  } else {
    throw {
      status: 400,
      message:
        "Provide either a valid userId or patient account credentials (name, email, password)",
    };
  }

  // Check if patient profile already exists
  const existingPatient = await patient.findOne({
    where: { userId },
  });

  if (existingPatient) {
    throw {
      status: 400,
      message: "Patient profile already exists for this user",
    };
  }

  // Verify doctor if provided
  if (patientData.doctorId) {
    const existingDoctor = await Doctor.findByPk(
      patientData.doctorId
    );

    if (!existingDoctor) {
      throw {
        status: 404,
        message: `Doctor with ID ${patientData.doctorId} not found`,
      };
    }
  }

  // Create patient
  const newPatient = await patient.create({
    userId,
    doctorId: patientData.doctorId || null,
    name: patientData.name,
    email: patientData.email
      ? patientData.email.toLowerCase()
      : null,
    phone: String(patientData.phone),
    dateOfBirth: patientData.dateOfBirth || null,
    gender: patientData.gender
      ? patientData.gender.toLowerCase()
      : null,
    bloodGroup: patientData.bloodGroup
      ? patientData.bloodGroup.toUpperCase()
      : null,
    address: patientData.address || null,
    medicalHistory: patientData.medicalHistory || null,
    status: patientData.status
      ? patientData.status.toLowerCase()
      : "active",
  });

  // Fetch created patient
  const createdPatient = await patient.findByPk(
    newPatient.patientId,
    {
      include: [
        {
          model: user,
          attributes: [
            "id",
            "name",
            "email",
            "roles",
          ],
        },
      ],
    }
  );

  return {
    patient: createdPatient,
    accessToken,
    refreshToken,
  };
};

/**
 * ============================================================
 * GET ALL PATIENTS
 * ============================================================
 */
export const getAllPatientsService = async () => {
  return await patient.findAll({
    include: [
      {
        model: user,
        attributes: [
          "id",
          "name",
          "email",
          "roles",
        ],
      },
    ],
  });
};

/**
 * ============================================================
 * GET PATIENT BY PATIENT ID
 * ============================================================
 */
export const getPatientByIdService = async (id) => {
  return await patient.findByPk(id, {
    include: [
      {
        model: user,
        attributes: [
          "id",
          "name",
          "email",
          "roles",
        ],
      },
    ],
  });
};

/**
 * ============================================================
 * GET LOGGED-IN PATIENT PROFILE
 * ============================================================
 *
 * Finds the patient using:
 *
 * req.user.id
 *      ↓
 * patients.userId
 *
 * This avoids requiring patientId in localStorage.
 */
export const getMyPatientProfileService = async (userId) => {
  const patientRecord = await patient.findOne({
    where: {
      userId,
    },
    include: [
      {
        model: user,
        attributes: [
          "id",
          "name",
          "email",
          "roles",
        ],
      },
    ],
  });

  if (!patientRecord) {
    throw {
      status: 404,
      message:
        "Patient profile not found for the logged-in user",
    };
  }

  return patientRecord;
};

/**
 * ============================================================
 * UPDATE PATIENT BY PATIENT ID
 * ============================================================
 */
export const updatePatientService = async (
  id,
  updateData
) => {
  const patientRecord = await patient.findByPk(id);

  if (!patientRecord) {
    throw {
      status: 404,
      message: "Patient not found",
    };
  }

  // Only allow fields that belong to the patient profile
  const allowedFields = [
    "name",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "bloodGroup",
    "address",
    "medicalHistory",
  ];

  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  // Normalize values
  if (filteredData.email) {
    filteredData.email =
      filteredData.email.toLowerCase();
  }

  if (filteredData.gender) {
    filteredData.gender =
      filteredData.gender.toLowerCase();
  }

  if (filteredData.bloodGroup) {
    filteredData.bloodGroup =
      filteredData.bloodGroup.toUpperCase();
  }

  if (filteredData.phone !== undefined) {
    filteredData.phone = String(filteredData.phone);
  }

  await patientRecord.update(filteredData);

  return await patient.findByPk(
    patientRecord.patientId,
    {
      include: [
        {
          model: user,
          attributes: [
            "id",
            "name",
            "email",
            "roles",
          ],
        },
      ],
    }
  );
};

/**
 * ============================================================
 * DELETE PATIENT
 * ============================================================
 */
export const deletePatientService = async (id) => {
  const patientRecord = await patient.findByPk(id);

  if (!patientRecord) {
    throw {
      status: 404,
      message: "Patient not found",
    };
  }

  await patientRecord.destroy();

  return patientRecord;
};
