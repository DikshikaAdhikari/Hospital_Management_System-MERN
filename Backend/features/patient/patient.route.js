
import express from "express";

import {
  getPatientProfile,
  updatePatientProfile,
  getAllPatients,
} from "./patient.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();


// Test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Patient route is working",
  });
});


// Patient profile
router.get(
  "/profile",
  authenticate,
  authorizeRoles("patient"),
  getPatientProfile
);


// Update profile
router.put(
  "/profile",
  authenticate,
  authorizeRoles("patient"),
  updatePatientProfile
);


// All patients
router.get(
  "/",
  authenticate,
  getAllPatients
);

export default router;