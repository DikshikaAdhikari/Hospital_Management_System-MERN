// NOTE: this script previously imported "../features/user/user.model.js"
// (folder is "users", plural) and "../features/doctor/doctor.model.js"
// (actual file is "doctormodel.js") — both paths don't exist, so this
// script threw ERR_MODULE_NOT_FOUND immediately and never ran. It also
// created users with `firstName`/`lastName`/`role`, but the actual User
// model only has `name` and `roles` — those calls would have failed
// validation even with correct imports. Both are fixed below.
import bcrypt from "bcrypt";
import User from "../features/users/user.model.js";
import Doctor from "../features/doctor/doctormodel.js";
import Department from "../features/departments/department.model.js";
import connectionDB from "../config/connection.js";

const seedDoctors = async () => {
  try {
    await connectionDB.authenticate();

    console.log("Database connected");

    // Find departments
    const cardiology = await Department.findOne({ where: { name: "Cardiology" } });
    const dermatology = await Department.findOne({ where: { name: "Dermatology" } });
    const dentistry = await Department.findOne({ where: { name: "Dentistry" } });
    const oncology = await Department.findOne({ where: { name: "Oncology" } });

    if (!cardiology || !dermatology || !dentistry || !oncology) {
      throw new Error("Departments not found. Run npm run seedDepartment first.");
    }

    const doctors = [
      {
        name: "Sarah Lee",
        email: "sarah.doctor@gmail.com",
        password: "Doctor@123",
        specialization: "Cardiologist",
        qualification: "MBBS, MD Cardiology",
        experience: 8,
        licenseNumber: "DOC-CARD-001",
        consultationFee: 1000,
      },
      {
        name: "Mark Smith",
        email: "mark.doctor@gmail.com",
        password: "Doctor@123",
        specialization: "Dermatologist",
        qualification: "MBBS, MD Dermatology",
        experience: 6,
        licenseNumber: "DOC-DERM-002",
        consultationFee: 800,
      },
      {
        name: "Lisa Roy",
        email: "lisa.doctor@gmail.com",
        password: "Doctor@123",
        specialization: "Dentist",
        qualification: "BDS, MDS",
        experience: 5,
        licenseNumber: "DOC-DENT-003",
        consultationFee: 700,
      },
      {
        name: "James Patel",
        email: "james.doctor@gmail.com",
        password: "Doctor@123",
        specialization: "Oncologist",
        qualification: "MBBS, MD Oncology",
        experience: 10,
        licenseNumber: "DOC-ONCO-004",
        consultationFee: 1500,
      },
    ];

    for (const doctorData of doctors) {
      const existingUser = await User.findOne({ where: { email: doctorData.email } });

      if (existingUser) {
        console.log(`User ${doctorData.email} already exists. Skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(doctorData.password, 10);

      // Create User (real columns: name, email, password, roles)
      const newUser = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        roles: "doctor",
      });

      // Create Doctor profile linked to that user
      await Doctor.create({
        userId: newUser.id,
        specialization: doctorData.specialization,
        qualification: doctorData.qualification,
        experience: doctorData.experience,
        licenseNumber: doctorData.licenseNumber,
        consultationFee: doctorData.consultationFee,
        status: "active",
      });

      console.log(`Doctor ${doctorData.name} created`);
    }

    console.log("All doctors created successfully");
    console.log("Next step: npm run seedDoctorDepartments");

    process.exit(0);
  } catch (error) {
    console.error("Error creating doctors:", error);
    process.exit(1);
  }
};

seedDoctors();
