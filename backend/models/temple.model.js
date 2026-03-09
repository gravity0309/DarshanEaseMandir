

import mongoose from "mongoose";
// import cloudinary from "../config/cloudinary.js";

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true
    },

    location: {
      type: String,
      required: true,
      trim: true,
      
      lowercase: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

  image: {
  url: {
    type: String
  },
  public_id: {
    type: String
  }
},
  },
  { timestamps: true }
);
templeSchema.index({ name: 1, location: 1 }, { unique: true });
templeSchema.index({
  name: "text",
  location: "text"
});

export const Temple = mongoose.model("Temple", templeSchema);