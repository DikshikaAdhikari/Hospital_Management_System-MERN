import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
        type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,

      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Experience in years",
    },

    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
  }
);

export default Doctor;