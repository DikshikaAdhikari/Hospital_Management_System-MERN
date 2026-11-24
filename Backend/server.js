import app from "./app.js";
import { connectionDB } from "./config/index.js";

const PORT = process.env.PORT || 3900;

const startServer = async () => {
  try {
    await connectionDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
