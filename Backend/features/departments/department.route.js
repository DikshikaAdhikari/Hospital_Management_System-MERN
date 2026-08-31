import express from "express";

import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "./department.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Admin only
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  createDepartment
);

// Everyone logged in
router.get("/", getAllDepartments);

router.get("/:id", authenticate, getDepartmentById);

// Admin only
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  updateDepartment
);

// Admin only
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteDepartment
);

export default router;