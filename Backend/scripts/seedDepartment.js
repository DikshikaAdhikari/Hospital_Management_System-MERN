import Department from "../features/departments/department.model.js";
import connectionDB from "../config/connection.js";

const seedDepartments = async () => {
  try {
    await connectionDB.authenticate();

    const departments = [
      {
        name: "Cardiology",
        description: "Department for heart and cardiovascular diseases",
      },
      {
        name: "Dermatology",
        description: "Department for skin, hair and nail conditions",
      },
      {
        name: "Dentistry",
        description: "Department for dental and oral health",
      },
      {
        name: "Oncology",
        description: "Department for cancer diagnosis and treatment",
      },
      {
        name: "Neurology",
        description: "Department for brain and nervous system disorders",
      },
      {
        name: "Orthopedics",
        description: "Department for bones, joints and muscles",
      },
    ];

    await Department.bulkCreate(departments, {
      ignoreDuplicates: true,
    });

    console.log("Departments seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding departments:", error);
    process.exit(1);
  }
};

seedDepartments();