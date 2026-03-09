

import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple" },
    amount: { type: Number, required: true },

    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);