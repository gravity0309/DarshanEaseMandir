import { DarshanSlot } from "../models/slot.model.js";

export const createSlot = async (req, res) => {
  const slot = await DarshanSlot.create(req.body);
  res.status(201).json(slot);
};

export const getSlots = async (req, res) => {
  const slots = await DarshanSlot.find().populate("temple");
  res.json(slots);
};