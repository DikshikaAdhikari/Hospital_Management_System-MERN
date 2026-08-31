import bcrypt from "bcrypt";
import User from "../features/users/user.model.js";

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: {
        email: "admin@hms.com",
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@hms.com",
      password: hashedPassword,
      roles: "admin",
    });

    console.log("Admin Seeded Successfully");
  } catch (error) {
    console.log(error.message);
  }
};

export default seedAdmin;