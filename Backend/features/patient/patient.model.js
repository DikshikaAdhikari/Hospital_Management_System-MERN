import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";
import user from "../users/user.model.js";
import Doctor from "../doctor/doctormodel.js";

const patient = sequelize.define(
  "patient",
  {

    patientId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
   userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "doctors",
        key: "id",
      },
      onDelete: "cascade",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },


    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },


    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },


    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },


    gender: {
      type: DataTypes.ENUM(
        "male",
        "female",
        "other"
      ),
      allowNull: false,
    },


    bloodGroup: {
      type: DataTypes.ENUM(
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
      ),
      allowNull: true,
    },


    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },


    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive"
      ),
      defaultValue: "active",
    },


  },
  {
    tableName: "patients",
    timestamps: true,
  }
);


export default patient;