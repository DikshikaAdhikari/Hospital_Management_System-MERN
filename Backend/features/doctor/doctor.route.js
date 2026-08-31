import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "./doctorcontroller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { validateDoctorCreation } from "../../middlewares/validation.middleware.js";

const doctorRouter = express.Router();

// Create doctor - requires authentication (JWT) and either doctor or admin role.
// NOTE: this used to be registered twice on the same path/method — Express
// only ever dispatches to the FIRST matching handler, so the second
// registration (authorizeRoles("admin")) was dead code and admins could
// never actually hit this route. Merged into one route with both roles.
doctorRouter.post(
  "/",
  authenticate,
  authorizeRoles("doctor", "admin"),
  validateDoctorCreation,
  createDoctor
);

// Get all doctors - requires authentication
doctorRouter.get("/", authenticate, getAllDoctors);

// Get doctor by ID - requires authentication
doctorRouter.get("/:id", authenticate, getDoctorById);

// Update doctor - requires authentication & admin role
doctorRouter.put("/:id", authenticate, authorizeRoles("doctor"), updateDoctor);

// Delete doctor - requires authentication & admin role
doctorRouter.delete("/:id", authenticate, authorizeRoles("doctor"), deleteDoctor);

export default doctorRouter;