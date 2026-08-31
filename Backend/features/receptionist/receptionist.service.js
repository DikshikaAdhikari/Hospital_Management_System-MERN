import Receptionist from "./receptionist.model.js";

export const createReceptionistService = async (data) => {
  return await Receptionist.create(data);
};

export const getAllReceptionistsService = async () => {
  return await Receptionist.findAll();
};