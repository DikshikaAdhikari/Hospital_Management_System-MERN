import express from "express";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  assignDoctor,
  updateAppointmentStatus,
  deleteAppointment,
} from "./appointment.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Patient creates an appointment request (department + date/time + reason).
// Admin/receptionist can also create one on a patient's behalf.
router.post("/", authenticate, authorizeRoles( "patient"), createAppointment);

// Listing is role-scoped inside the controller: patients/doctors only ever
// see their own appointments; receptionist/admin see everything.
router.get("/", authenticate, getAllAppointments);

router.get("/:id", authenticate, getAppointmentById);

// Full-record edits are admin-only — the dedicated /assign and /status
// endpoints below are how receptionist/doctor make their respective
// changes, so this generic endpoint can't be used to bypass those checks.
router.put("/:id", authenticate, authorizeRoles("admin"), updateAppointment);

// Receptionist/admin only: pending -> assigned.
router.put(
  "/:id/assign",
  authenticate,
  authorizeRoles("admin", "receptionist"),
  assignDoctor
);

// Doctor/admin only: assigned -> approved | rejected. The service layer
// additionally verifies a doctor caller is the one actually assigned to
// this appointment (see updateAppointmentStatusService).
router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("admin", "doctor"),
  updateAppointmentStatus
);

// Admin/receptionist only — a patient must never be able to delete
// someone else's (or even their own) appointment via this route.
router.delete("/:id", authenticate, authorizeRoles("admin", "receptionist"), deleteAppointment);

export default router;
