import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import express from 'express';
import { connectionDB } from './config/index.js';
import authRouter from './features/auth/auth.route.js';
import doctorRouter from './features/doctor/doctor.route.js';
import patientRouter from './features/patient/patient.route.js';
import receptionistRoutes from "./features/receptionist/receptionist.routes.js";
import appointmentRoutes from "./features/appointments/appointment.routes.js";
import seedAdmin from "./scripts/seedAdmin.js";
import departmentRoutes from "./features/departments/department.route.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-management-system-mern-1f443ged1.vercel.app",
      "https://hospital-management-system-mern-5wv5huwky.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());   
await connectionDB();
await seedAdmin();
app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patient", patientRouter);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/departments", departmentRoutes);

//test route
app.get('/', (req, res) => {
    res.send('Hello World');
});
    

export default app;
