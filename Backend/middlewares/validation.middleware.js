/**
 * Middleware for validating bare-minimum doctor creation input.
 */
export const validateDoctorCreation = (req, res, next) => {
  // If user is authenticated and userId is not explicitly in body, default to authenticated user's ID
  if (!req.body.userId && req.user && req.user.id) {
    req.body.userId = req.user.id;
  }

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
  } = req.body;

  const errors = [];

  // User identification validation
  if (!userId) {
    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("User ID or name is required");
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      errors.push("Valid email is required when creating a new doctor user");
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      errors.push("Password (at least 6 characters) is required when creating a new doctor user");
    }
  } else if (isNaN(Number(userId)) || Number(userId) <= 0) {
    errors.push("userId must be a valid positive integer");
  }

  // Doctor profile fields validation
  if (!specialization || typeof specialization !== "string" || !specialization.trim()) {
    errors.push("Specialization is required");
  }

  if (!qualification || typeof qualification !== "string" || !qualification.trim()) {
    errors.push("Qualification is required");
  }

  if (experience === undefined || experience === null || isNaN(Number(experience)) || Number(experience) < 0) {
    errors.push("Experience must be a non-negative number of years");
  }

  if (licenseNumber === undefined || licenseNumber === null || !String(licenseNumber).trim()) {
    errors.push("License number is required");
  }

  if (consultationFee === undefined || consultationFee === null || isNaN(Number(consultationFee)) || Number(consultationFee) < 0) {
    errors.push("Consultation fee must be a valid positive number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Middleware for validating patient creation input based on DB model schema.
 */
export const validatePatientCreation = (req, res, next) => {
  // Default userId to authenticated user ID if logged in and userId not specified
  if (!req.body.userId && req.user && req.user.id) {
    req.body.userId = req.user.id;
  }

  const {
    userId,
    doctorId,
    name,
    email,
    password,
    phone,
    dateOfBirth,
    gender,
    bloodGroup,
    status,
  } = req.body;

  const errors = [];

  // 1. User identification validation
  if (!userId) {
    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("name is required when creating a new patient account");
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("a valid email address is required when creating a new patient account");
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      errors.push("password (minimum 6 characters) is required when creating a new patient account");
    }
  } else if (isNaN(Number(userId)) || Number(userId) <= 0) {
    errors.push("userId must be a positive integer");
  }

  // 2. Doctor ID validation (Optional UUID format check)
  if (doctorId) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (typeof doctorId !== "string" || !uuidRegex.test(doctorId)) {
      errors.push("doctorId must be a valid UUID format (e.g. 123e4567-e89b-12d3-a456-426614174000)");
    }
  }

  // 3. Name validation
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Patient name is required (minimum 2 characters)");
  }

  // 4. Email format validation (optional on patient record)
  if (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    errors.push("email must be a valid email address");
  }

  // 5. Phone validation
  if (!phone || (typeof phone !== "string" && typeof phone !== "number")) {
    errors.push("Patient phone number is required");
  } else {
    const phoneStr = String(phone).trim();
    if (phoneStr.length < 7 || phoneStr.length > 15) {
      errors.push("phone number must be between 7 and 15 digits");
    }
  }

  // 6. Date of Birth validation (Optional YYYY-MM-DD)
  if (dateOfBirth) {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof dateOfBirth !== "string" || !dobRegex.test(dateOfBirth) || isNaN(Date.parse(dateOfBirth))) {
      errors.push("dateOfBirth must be a valid date string in YYYY-MM-DD format");
    } else if (new Date(dateOfBirth) > new Date()) {
      errors.push("dateOfBirth cannot be a future date");
    }
  }

  // 7. Gender validation (Required ENUM: male, female, other)
  const allowedGenders = ["male", "female", "other"];
  if (!gender || typeof gender !== "string" || !allowedGenders.includes(gender.trim().toLowerCase())) {
    errors.push(`gender is required and must be one of: ${allowedGenders.join(", ")}`);
  }

  // 8. Blood Group validation (Optional ENUM: A+, A-, B+, B-, AB+, AB-, O+, O-)
  const allowedBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  if (bloodGroup) {
    if (typeof bloodGroup !== "string" || !allowedBloodGroups.includes(bloodGroup.trim().toUpperCase())) {
      errors.push(`bloodGroup must be one of: ${allowedBloodGroups.join(", ")}`);
    }
  }

  // 9. Status validation (Optional ENUM: active, inactive)
  if (status) {
    const allowedStatuses = ["active", "inactive"];
    if (typeof status !== "string" || !allowedStatuses.includes(status.trim().toLowerCase())) {
      errors.push(`status must be either 'active' or 'inactive'`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Patient validation failed",
      errors,
    });
  }

  next();
};
