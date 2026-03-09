import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import templeRouter from "./routes/temple.route.js";
import slotRouter from "./routes/slot.route.js";
import bookingRouter from "./routes/booking.route.js";
import donationRouter from "./routes/donation.route.js";
import adminRouter from "./routes/admin.route.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/temples", templeRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export { app };