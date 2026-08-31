import express from "express";

import {
  createReceptionist,
  getAllReceptionists,
} from "./receptionist.controller.js";

const router = express.Router();

router.post("/", createReceptionist);
router.get("/", getAllReceptionists);

export default router;