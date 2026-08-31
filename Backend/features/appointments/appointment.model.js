import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "patients",
        key: "patientId",
      },
      onDelete: "CASCADE",
    },

    // Nullable: at creation time the patient has not been assigned a doctor
    // yet. The receptionist sets this (see assignDoctorService) once they
    // pick a doctor for the request.
    doctorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "doctors",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    // The department the patient requested. Set at creation time so the
    // receptionist can see which department to pull an available doctor
    // from, and so the assign step can validate the chosen doctor actually
    // belongs to it.
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "departments",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Workflow states:
    //   pending   -> just created by the patient, awaiting receptionist
    //   assigned  -> receptionist has assigned a doctor
    //   approved  -> assigned doctor approved the request
    //   rejected  -> assigned doctor rejected the request
    status: {
      type: DataTypes.ENUM(
        "pending",
        "assigned",
        "approved",
        "rejected"
      ),
      defaultValue: "pending",
    },

    // Flips to true the moment the doctor approves/rejects, so the patient
    // dashboard knows there's a decision to show.
    patientNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
  }
);

export default appointment;