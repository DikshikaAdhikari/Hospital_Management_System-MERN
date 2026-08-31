

import Doctor from "../features/doctor/doctormodel.js";
import Department from "../features/departments/department.model.js";
import DoctorDepartment from "../features/doctordeparment/doctordepartment.model.js";
import connectionDB from "../config/connection.js";

const seedDoctorDepartments = async () => {
  try {
    await connectionDB.authenticate();

    const cardiology = await Department.findOne({
      where: { name: "Cardiology" },
    });

    const dermatology = await Department.findOne({
      where: { name: "Dermatology" },
    });

    const dentistry = await Department.findOne({
      where: { name: "Dentistry" },
    });

    const oncology = await Department.findOne({
      where: { name: "Oncology" },
    });

    const sarah = await Doctor.findOne({
      where: { licenseNumber: "DOC-CARD-001" },
    });

    const mark = await Doctor.findOne({
      where: { licenseNumber: "DOC-DERM-002" },
    });

    const lisa = await Doctor.findOne({
      where: { licenseNumber: "DOC-DENT-003" },
    });

    const james = await Doctor.findOne({
      where: { licenseNumber: "DOC-ONCO-004" },
    });

    await DoctorDepartment.bulkCreate([
      {
        doctorId: sarah.id,
        departmentId: cardiology.id,
      },
      {
        doctorId: mark.id,
        departmentId: dermatology.id,
      },
      {
        doctorId: lisa.id,
        departmentId: dentistry.id,
      },
      {
        doctorId: james.id,
        departmentId: oncology.id,
      },
    ]);

    console.log("Doctor departments created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDoctorDepartments();