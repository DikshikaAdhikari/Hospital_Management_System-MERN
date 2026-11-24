
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../users/user.model.js";
import patient from "../patient/patient.model.js";
import Doctor from "../doctor/doctormodel.js";
import Department from "../departments/department.model.js";
import DoctorDepartment from "../doctordeparment/doctordepartment.model.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Helper — returns the JWT access secret or throws a clear 500-level error
 * so that a missing environment variable never surfaces as the confusing
 * "secretOrPrivateKey must have a value" message from jsonwebtoken.
 */
const getAccessSecret = () => {
  const secret = process.env.JWT_Access_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw {
      status: 500,
      message:
        "JWT secret is not configured on the server. Please set JWT_SECRET in environment variables.",
    };
  }
  return secret;
};

/**
 * Helper — returns the JWT refresh secret.
 * Falls back to the access secret if JWT_REFRESH_SECRET is not set so that a
 * missing variable doesn't silently produce an undefined key.
 */
const getRefreshSecret = () => {
  const secret =
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_Access_SECRET ||
    process.env.JWT_SECRET;
  if (!secret) {
    throw {
      status: 500,
      message:
        "JWT secret is not configured on the server. Please set JWT_SECRET in environment variables.",
    };
  }
  return secret;
};

/**
 * ============================================================
 * REGISTER USER
 * ============================================================
 *
 * For patient registration:
 * 1. Create user account
 * 2. Automatically create patient profile
 *
 * For doctor registration:
 * 1. Create user account
 * 2. Automatically create the matching Doctor profile (this was the
 *    missing part — a "doctor" signup used to only ever create a row in
 *    `users`, so the account could log in and see the doctor dashboard,
 *    but had no `doctors` record. With no Doctor record, the receptionist
 *    can never find/assign them, and the appointment endpoints can never
 *    match them to an appointment — the doctor dashboard would always be
 *    empty and Approve/Reject would always be rejected as unauthorized.)
 * 3. If a departmentId was supplied, link the doctor to it so the
 *    receptionist's assign step can find them for that department.
 *
 * For receptionist:
 * Only create the user account here.
 */
export const registerService = async ({
  name,
  email,
  password,
  role,
  phone,
  dateOfBirth,
  gender,
  bloodGroup,
  address,
  medicalHistory,
  specialization,
  qualification,
  experience,
  licenseNumber,
  consultationFee,
  departmentId,
}) => {
  // Normalize values
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedRole = role?.trim().toLowerCase() || "patient";

  // Check if email already exists
  const checkEmail = await user.findOne({
    where: { email: normalizedEmail },
  });

  if (checkEmail) {
    throw {
      status: 400,
      message: "Email already exists",
    };
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create user
  const newUser = await user.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    roles: normalizedRole,
  });

  /*
   * ==========================================================
   * AUTOMATICALLY CREATE PATIENT PROFILE
   * ==========================================================
   *
   * This is the missing part in your current project.
   *
   * The newly-created user's ID becomes patients.userId.
   */
  if (normalizedRole === "patient") {
    try {
      // Defensive guard: a patient profile should never already exist for
      // a user we just created a row for above, but check explicitly
      // rather than assume — mirrors the same guard used for doctors.
      const existingPatient = await patient.findOne({
        where: { userId: newUser.id },
      });

      if (!existingPatient) {
        await patient.create({
          userId: newUser.id,
          name: name.trim(),
          email: normalizedEmail,

          // These are optional because your patient model
          // allows them to be null.
          phone: phone ? String(phone) : "Not provided",
          dateOfBirth: dateOfBirth || null,
          gender: gender ? gender.toLowerCase() : "other",
          bloodGroup: bloodGroup ? bloodGroup.toUpperCase() : null,
          address: address || null,
          medicalHistory: medicalHistory || null,
          status: "active",
        });
      }
    } catch (patientError) {
      // If patient creation fails, remove the user that was
      // just created so we don't leave an incomplete account.
      await newUser.destroy();

      console.error("Patient profile creation error:", patientError);

      throw {
        status: 400,
        message:
          patientError.message ||
          "User created but patient profile could not be created",
      };
    }
  }

  /*
   * ==========================================================
   * AUTOMATICALLY CREATE DOCTOR PROFILE
   * ==========================================================
   *
   * This was the missing part for doctors — mirrors the patient branch
   * above. The newly-created user's ID becomes doctors.userId.
   */
  if (normalizedRole === "doctor") {
    try {
      if (!specialization || !qualification || experience === undefined || experience === null || !licenseNumber || consultationFee === undefined || consultationFee === null) {
        throw {
          status: 400,
          message:
            "specialization, qualification, experience, licenseNumber and consultationFee are required to register as a doctor",
        };
      }

      const newDoctor = await Doctor.create({
        userId: newUser.id,
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experience: Number(experience),
        licenseNumber: String(licenseNumber).trim(),
        consultationFee: Number(consultationFee),
        status: "active",
      });

      // Link the doctor to a department (if one was chosen) so the
      // receptionist's assign step — which only offers doctors that
      // belong to the requested department — can actually find them.
      if (departmentId) {
        const departmentRecord = await Department.findByPk(departmentId);
        if (!departmentRecord) {
          throw {
            status: 404,
            message: `Department with ID ${departmentId} not found`,
          };
        }

        await DoctorDepartment.create({
          doctorId: newDoctor.id,
          departmentId: departmentRecord.id,
        });
      }
    } catch (doctorError) {
      // If doctor profile creation fails, remove the user that was
      // just created so we don't leave an incomplete account.
      await newUser.destroy();

      console.error("Doctor profile creation error:", doctorError);

      throw {
        status: doctorError.status || 400,
        message:
          doctorError.message ||
          "User created but doctor profile could not be created",
      };
    }
  }

  // Validate secrets before signing — gives a clear 500 error instead of the
  // cryptic "secretOrPrivateKey must have a value" from jsonwebtoken.
  const accessSecret = getAccessSecret();
  const refreshSecret = getRefreshSecret();

  // Generate access token
  const accessToken = jwt.sign(
    {
      id: newUser.id,
      role: newUser.roles,
    },
    accessSecret,
    {
      expiresIn:
        process.env.JWT_Access_EXPIRES_IN || "3650d",
    }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      id: newUser.id,
      role: newUser.roles,
    },
    refreshSecret,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || "3650d",
    }
  );

  const userData = newUser.toJSON();

  delete userData.password;

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
};

/**
 * ============================================================
 * LOGIN USER
 * ============================================================
 */
export const loginService = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const newUser = await user.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!newUser) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    newUser.password
  );

  if (!isPasswordValid) {
    throw {
      status: 400,
      message: "Please check your email or password",
    };
  }

  // Validate secrets before signing
  const accessSecret = getAccessSecret();
  const refreshSecret = getRefreshSecret();

  // Generate access token
  const accessToken = jwt.sign(
    {
      id: newUser.id,
      role: newUser.roles,
    },
    accessSecret,
    {
      expiresIn:
        process.env.JWT_Access_EXPIRES_IN || "3650d",
    }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      id: newUser.id,
      role: newUser.roles,
    },
    refreshSecret,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || "3650d",
    }
  );

  const userData = newUser.toJSON();

  delete userData.password;

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};
