import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const DoctorDepartment = sequelize.define(
  "DoctorDepartment",
  {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },


    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {
            model: "doctors",
            // Doctor's actual primary key column is `id` (see
            // features/doctor/doctormodel.js) — not `doctorId`. Pointing a
            // real Postgres FK constraint at a column that doesn't exist
            // makes `sequelize.sync()` fail to create/alter this table.
            key: "id",
        },
        onDelete: "CASCADE",
    },


    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {
            model: "departments",
            key: "id",
        },
        onDelete: "CASCADE",
    },


    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Experience in years",
    },


    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },


  },
  {
    tableName:"doctor_departments",
    timestamps:true,
  }
);


export default DoctorDepartment;