
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedCount: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
        required: true,//current add

      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* COMPOUND INDEX (BEST FOR QUERIES) */
slotSchema.index({ temple: 1, date: 1 });

/* Optional: Faster slot sorting */
slotSchema.index({ date: 1, startTime: 1 });

/* Virtual field */
slotSchema.virtual("availableSeats").get(function () {
  return this.capacity - this.bookedCount;
});

slotSchema.set("toJSON", { virtuals: true });
slotSchema.set("toObject", { virtuals: true });

export const DarshanSlot = mongoose.model("DarshanSlot", slotSchema);