// Read-only diagnostic. Registration (auth.service.js) now always creates
// a matching `patients` row for every role="patient" user, so this should
// normally print nothing. It exists to surface any user accounts that
// predate that fix (or were created some other way) and are missing a
// patient profile — WITHOUT silently deleting, modifying, or auto-creating
// anything on their behalf, per the "report them separately" requirement.
//
// Usage: npm run reportOrphanedPatients

import User from "../features/users/user.model.js";
import Patient from "../features/patient/patient.model.js";
import sequelize from "../config/connection.js";

const reportOrphanedPatients = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const patientUsers = await User.findAll({
      where: { roles: "patient" },
      attributes: ["id", "name", "email", "createdAt"],
    });

    if (patientUsers.length === 0) {
      console.log("No users with role 'patient' found.");
      process.exit(0);
    }

    const orphaned = [];

    for (const patientUser of patientUsers) {
      const profile = await Patient.findOne({
        where: { userId: patientUser.id },
      });

      if (!profile) {
        orphaned.push(patientUser);
      }
    }

    console.log(`Checked ${patientUsers.length} patient user(s).`);

    if (orphaned.length === 0) {
      console.log("All patient users have a matching patients profile. Nothing to report.");
    } else {
      console.log(`\nFound ${orphaned.length} user(s) with role "patient" and NO matching patients row:\n`);
      orphaned.forEach((u) => {
        console.log(`  - id=${u.id}  email=${u.email}  name=${u.name}  createdAt=${u.createdAt?.toISOString?.() || u.createdAt}`);
      });
      console.log(
        "\nThese were NOT modified or deleted. Decide manually whether to create a" +
        " matching patients profile for each (e.g. via the patient service) or" +
        " investigate how they were created without one."
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error while reporting orphaned patients:", error);
    process.exit(1);
  }
};

reportOrphanedPatients();
