import { DataTypes } from "sequelize";
// NOTE: every other model in this project imports the raw Sequelize
// instance from config/connection.js. This file was importing it from
// config/index.js instead — the file that ALSO imports this model to wire
// up associations (`user.hasOne(Doctor, ...)` etc). That's a circular
// import: config/index.js starts loading -> imports user.model.js -> which
// imports back from config/index.js before it has finished -> Node hands
// back an uninitialized "sequelize" binding -> config/index.js then tries
// to call `user.hasOne(...)` on a `user` that is still in the temporal
// dead zone -> "Cannot access 'user' before initialization". Importing
// directly from config/connection.js (like every other model) breaks the
// cycle entirely.
import sequelize from "../../config/connection.js";

const user = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.ENUM('admin', 'doctor', 'receptionist', 'patient' ),
        defaultValue: "patient",
    },
    refreshToken: {
        type: DataTypes.TEXT,
       
    },


},
{
    tableName: "users",
    timestamps: true,
}
);

export default user;