

import { Temple } from "../models/temple.model.js";
import { DarshanSlot } from "../models/slot.model.js";
import cloudinary from "../config/cloudinary.js";


export const createTemple = async (req, res, next) => {
  try {

    const { name, location, description } = req.body;

    const normalizedName = name.toLowerCase().trim();
    const normalizedLocation = location.toLowerCase().trim();

    // check duplicate
    const existingTemple = await Temple.findOne({
      name: normalizedName,
      location: normalizedLocation,
    });

    /* IF DUPLICATE -> DELETE UPLOADED IMAGE */

    if (existingTemple) {

      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }

      return res.status(400).json({
        success: false,
        message: `${name} already exists in ${location}`,
      });
    }

    /* SAVE IMAGE DATA */

    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const temple = await Temple.create({
      name,
      location,
      description,
      image: imageData
    });

    res.status(201).json({
      success: true,
      message: "Temple created successfully",
      temple
    });

  } catch (error) {
    next(error);
  }
};

/*
GET ALL TEMPLES
GET /api/v1/temples
PUBLIC
*/


export const getTemples = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Search by temple name or location
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const temples = await Temple.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Temple.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      count: temples.length,
      data: temples,
    });

  } catch (error) {
    next(error);
  }
};



export const updateTemple = async (req, res, next) => {
  try {

    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    /* UPDATE BASIC FIELDS */

    temple.name = req.body.name || temple.name;
    temple.location = req.body.location || temple.location;
    temple.description = req.body.description || temple.description;

    /* IF NEW IMAGE UPLOADED */

    if (req.file) {

      // delete old image
      if (temple.image && temple.image.public_id) {
        await cloudinary.uploader.destroy(temple.image.public_id);
      }

      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "temples",
      });

      temple.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await temple.save();

    res.status(200).json({
      success: true,
      message: "Temple updated successfully",
      data: temple,
    });

  } catch (error) {
    next(error);
  }
};


export const deleteTemple = async (req, res, next) => {
  try {

    const templeId = req.params.id;

    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found"
      });
    }

    /* CHECK IF SLOTS EXIST */

    const existingSlots = await DarshanSlot.countDocuments({
      temple: templeId
    });

    if (existingSlots > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete temple with existing slots"
      });
    }

    /* DELETE IMAGE FROM CLOUDINARY */

    if (temple.image && temple.image.public_id) {

      console.log("Deleting Cloudinary image:", temple.image.public_id);

      const result = await cloudinary.uploader.destroy(
        temple.image.public_id
      );

      console.log("Cloudinary delete result:", result);
    }

    /* DELETE TEMPLE FROM DATABASE */

    await temple.deleteOne();

    res.status(200).json({
      success: true,
      message: "Temple and image deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

/*
GET SINGLE TEMPLE
GET /api/v1/temples/:id
PUBLIC
*/

export const getTempleById = async (req, res, next) => {
  try {

    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found"
      });
    }

    res.status(200).json({
      success: true,
      data: temple
    });

  } catch (error) {
    next(error);
  }
};