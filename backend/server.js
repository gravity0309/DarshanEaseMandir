

import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import { seedAdmin } from "./utils/seedAdmin.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    // Seed Admin Automatically
    await seedAdmin();

    const PORT = process.env.PORT || 8000;

    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();