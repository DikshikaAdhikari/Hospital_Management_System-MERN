import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Receptionist = sequelize.define(
  "Receptionist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    shift: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    deskNumber: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "receptionists",
    timestamps: true,
  }
);

export default Receptionist;