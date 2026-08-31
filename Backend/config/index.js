import sequelize from "../config/connection.js";
import user from "../features/users/user.model.js";
import appointment from "../features/appointments/appointment.model.js";
import Department from "../features/departments/department.model.js";
import DoctorDepartment from "../features/doctordeparment/doctordepartment.model.js";
import patient from "../features/patient/patient.model.js";
import Doctor from "../features/doctor/doctormodel.js";

import receptionist from "../features/receptionist/receptionist.model.js";


//connecting relationships
user.hasOne(Doctor, { 
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Doctor.belongsTo(user, {
  foreignKey: "userId",
});

user.hasOne(patient, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

patient.belongsTo(user, {
  foreignKey: "userId",
});

// Doctor ↔ Department (many-to-many through DoctorDepartment)
// NOTE: this used to be defined twice with different options (the second
// call silently overwrote the first's alias); consolidated to one
// definition per direction, both explicitly aliased so the doctor service
// can `include` them predictably.

Doctor.belongsToMany(Department, {
  through: DoctorDepartment,
  foreignKey: "doctorId",
  otherKey: "departmentId",
  as: "departments",
});

Department.belongsToMany(Doctor, {
  through: DoctorDepartment,
  foreignKey: "departmentId",
  otherKey: "doctorId",
  as: "doctors",
});

Doctor.hasMany(DoctorDepartment, {
  foreignKey: "doctorId",
  as: "doctorDepartments",
});

DoctorDepartment.belongsTo(Doctor, {
  foreignKey: "doctorId",
});

Department.hasMany(DoctorDepartment, {
  foreignKey: "departmentId",
  as: "doctorDepartments",
});

DoctorDepartment.belongsTo(Department, {
  foreignKey: "departmentId",
});


// Patient ↔ Appointment

patient.hasMany(appointment, {
  foreignKey: "patientId",
  sourceKey: "patientId",
  onDelete: "CASCADE",
  as: "appointments",
});

appointment.belongsTo(patient, {
  foreignKey: "patientId",
   targetKey: "patientId",
   as: "patient",
});

// Doctor ↔ Appointment

Doctor.hasMany(appointment, {
  foreignKey: "doctorId",
  onDelete: "CASCADE",
  sourceKey: "id",
  as: "appointments",
});

appointment.belongsTo(Doctor, {
  foreignKey: "doctorId",
  targetKey: "id",
  // NOTE: aliased lowercase "doctor" (not the default "Doctor") because the
  // existing frontend (Overview.jsx, AppointmentTable.jsx, etc.) already
  // reads `apt.doctor?.name` everywhere. Aliasing here avoids touching every
  // frontend file just to match Sequelize's default PascalCase alias.
  as: "doctor",
});

// Department ↔ Appointment
// Every appointment request now records the department the patient asked
// for (see appointment.model.js), so this relation is live (it used to be
// commented out because the column didn't exist yet).

Department.hasMany(appointment, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  as: "appointments",
});

appointment.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});
 // user.model.js
user.hasOne(receptionist, {
  foreignKey: "userId",
});

// receptionist.model.js
receptionist.belongsTo(user, {
  foreignKey: "userId",
});




 const connectionDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
        // NOTE: alter:true so the reworked `appointments` table (new
        // departmentId column, nullable doctorId, patientNotified flag, and
        // the pending/assigned/approved/rejected status enum) actually gets
        // applied to a database that already has the old table. Postgres
        // ENUM columns are the one thing sync({alter:true}) does NOT reliably
        // migrate in place — if you hit an enum-related error on startup,
        // drop the existing `appointments` table in your dev DB (there's no
        // production data to preserve here) and let sync recreate it fresh.
        await sequelize.sync(
            { alter: true }
        );
        console.log("Database synchronized successfully.");
    } 
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
export { connectionDB, sequelize , appointment, user, 
Department, DoctorDepartment, patient, Doctor, receptionist
};
