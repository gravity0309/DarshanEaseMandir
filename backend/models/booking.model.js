


import mongoose from "mongoose";
const devoteeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String
});

const ticketSchema = new mongoose.Schema({
  qrToken: {
    type: String,
    required: true
  },
  qrCode: {
    type: String
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanSlot",
      required: true,
    },

    persons: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
     devotees:[devoteeSchema],

    visitDate: {
      type: Date,
      required: true,
    },
     amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
    qrCode: {
    type: String
  },

  isCheckedIn: {
    type: Boolean,
    default: false
  },
  tickets: [ticketSchema], // multiple QR codes

},
    
  
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);