

import { DarshanSlot } from "../models/slot.model.js";
import { Temple } from "../models/temple.model.js";


export const createSlot = async (req, res, next) => {
  try {

    const { templeId, date, startTime, endTime, capacity, price } = req.body;

    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found"
      });
    }

    /* Normalize date */

    const slotDate = new Date(date);
    slotDate.setHours(0,0,0,0);

    /* CHECK OVERLAP */

    const overlappingSlot = await DarshanSlot.findOne({
      temple: templeId,
      date: slotDate,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      isActive: true
    });

    if (overlappingSlot) {
      return res.status(400).json({
        success: false,
        message: "Slot time overlaps with an existing slot"
      });
    }

    /* CREATE SLOT */

    const slot = await DarshanSlot.create({
      temple: templeId,
      date: slotDate,
      startTime,
      endTime,
      capacity,
      price
    });

    res.status(201).json({
      success: true,
      slot
    });

  } catch (error) {
    next(error);
  }
};


export const getSlots = async (req, res, next) => {
  try {
    const { templeId, date, available, page = 1, limit = 10 } = req.query;

    const filter = {
      isActive: { $ne: false }
    };

    /* FILTER BY TEMPLE */
    if (templeId) {
      filter.temple = templeId;
    }

    /* FILTER BY DATE */
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end
      };
    }

    /* ONLY AVAILABLE SLOTS */
    if (available === "true") {
      filter.$expr = {
        $gt: ["$capacity", "$bookedCount"]
      };
    }

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const total = await DarshanSlot.countDocuments(filter);

    const slots = await DarshanSlot.find(filter)
      .populate("temple", "name location")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      page: pageNumber,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
      count: slots.length,
      data: slots
    });

  } catch (error) {
    next(error);
  }
};





export const updateSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    let { date, startTime, endTime, capacity, price, isActive } = req.body;

    // Convert date string to Date
    if (date) date = new Date(date);

    if (capacity !== undefined && capacity < slot.bookedCount) {
      return res.status(400).json({
        success: false,
        message: "Cannot reduce capacity below booked seats",
      });
    }

    const newDate = date || slot.date;
    const newStart = startTime || slot.startTime;
    const newEnd = endTime || slot.endTime;

    // Check overlap with other slots
    const overlappingSlot = await DarshanSlot.findOne({
      _id: { $ne: slot._id },
      temple: slot.temple,
      date: newDate,
      $or: [
        {
          startTime: { $lt: newEnd },
          endTime: { $gt: newStart },
        },
      ],
    });

    if (overlappingSlot) {
      return res.status(400).json({
        success: false,
        message: "Updated slot overlaps with another slot",
      });
    }

    // Update fields if provided
    if (capacity !== undefined) slot.capacity = capacity;
    if (date) slot.date = date;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (price !== undefined) slot.price = price;
    if (isActive !== undefined) slot.isActive = isActive;

    await slot.save();

    res.status(200).json({
      success: true,
      slot,
    });
  } catch (error) {
    next(error);
  }
};
/*
   DELETE SLOT
   DELETE /api/v1/slots/:id
   ADMIN
*/
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    await slot.deleteOne();

    res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotsByTemple = async (req, res, next) => {
  try {

    const templeId = req.params.templeId;

    const slots = await DarshanSlot.find({ temple: templeId })
      .populate("temple", "name location");

    res.status(200).json({
      success: true,
      total: slots.length,
      slots
    });

  } catch (error) {
    next(error);
  }
};