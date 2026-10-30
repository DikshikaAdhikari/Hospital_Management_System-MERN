import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import { connectionDB } from "./config/index.js";
import seedAdmin from "./scripts/seedAdmin.js";

const PORT = process.env.PORT || 3900;

const startServer = async () => {
  await connectionDB();
  await seedAdmin();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
