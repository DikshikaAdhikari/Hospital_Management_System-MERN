
import dotenv from 'dotenv';
dotenv.config();

import cors from "cors";
import express from 'express';

import authRouter from './features/auth/auth.route.js';
import doctorRouter from './features/doctor/doctor.route.js';
import patientRouter from './features/patient/patient.route.js';
import receptionistRoutes from "./features/receptionist/receptionist.routes.js";
import appointmentRoutes from "./features/appointments/appointment.routes.js";
import departmentRoutes from "./features/departments/department.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://hospital-management-system-mern-mu.vercel.app",
  "https://hospital-management-system-mern-5wv5huwky.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse incoming JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patient", patientRouter);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/departments", departmentRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Hospital Management System API is running.');
});

export default app;
