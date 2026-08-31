import {
  createReceptionistService,
  getAllReceptionistsService,
} from "./receptionist.service.js";

export const createReceptionist = async (req, res) => {
  try {
    const receptionist = await createReceptionistService(req.body);

    res.status(201).json({
      success: true,
      data: receptionist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReceptionists = async (req, res) => {
  try {
    const receptionists = await getAllReceptionistsService();

    res.status(200).json({
      success: true,
      data: receptionists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};