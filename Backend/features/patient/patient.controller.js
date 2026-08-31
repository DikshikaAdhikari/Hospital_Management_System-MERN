
import patient from "./patient.model.js";


// =====================================================
// GET LOGGED-IN PATIENT PROFILE
// GET /api/patient/profile
// =====================================================

export const getPatientProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("Getting patient profile for userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const patientData = await patient.findOne({
      where: {
        userId: userId,
      },
    });

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: patientData,
    });

  } catch (error) {
    console.error("Get patient profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE LOGGED-IN PATIENT PROFILE
// PUT /api/patient/profile
// =====================================================

export const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("Updating patient profile for userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const patientData = await patient.findOne({
      where: {
        userId: userId,
      },
    });

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      medicalHistory,
    } = req.body;

    await patientData.update({
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      medicalHistory,
    });

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: patientData,
    });

  } catch (error) {
    console.error("Update patient profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update patient profile",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL PATIENTS
// GET /api/patient
// =====================================================

export const getAllPatients = async (req, res) => {
  try {
    const patients = await patient.findAll();

    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });

  } catch (error) {
    console.error("Get all patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};