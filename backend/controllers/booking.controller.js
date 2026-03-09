import { Booking } from "../models/booking.model.js";
import { DarshanSlot } from "../models/slot.model.js";
import QRCode from "qrcode";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const createBooking = async (req, res, next) => {
  try {
    const { slotId, persons, visitDate, devotees } = req.body;

    // 1️⃣ Check slot exists
    const slot = await DarshanSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    // 2️⃣ Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      slot: slotId,
      status: "CONFIRMED",
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already booked this slot",
      });
    }

    // 3️⃣ Check seat availability
    if (slot.bookedCount + persons > slot.capacity) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    // 4️⃣ Update slot booking count
    slot.bookedCount += persons;
    await slot.save();

    // 5️⃣ Generate QR tickets (1 person = 1 QR)
    const tickets = [];

    for (let i = 0; i < persons; i++) {

      // unique token for each ticket
      const token = crypto.randomBytes(16).toString("hex");

      const verificationUrl =
        `http://192.168.1.42:8000/api/v1/bookings/verify-ticket?token=${token}`;

      const qrCode = await QRCode.toDataURL(verificationUrl);

      tickets.push({
        qrToken: token,
        qrCode: qrCode,
        isUsed: false
      });
    }
    const totalAmount = slot.price * persons;

    // 6️⃣ Create booking
    const booking = await Booking.create({
      user: req.user._id,
      temple: slot.temple,
      slot: slot._id,
      persons,
      visitDate,
      amount: totalAmount,
      devotees,
      status: "CONFIRMED",
      tickets
    });

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    });

  } catch (error) {
    next(error);
  }
};





export const cancelBooking = async (req, res, next) => {
  try {
    // Fetch the booking by ID and populate slot
    const booking = await Booking.findById(req.params.id).populate("slot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Only the booking user can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Decrement the bookedCount in the slot if it exists
    if (booking.slot) {
      await DarshanSlot.findByIdAndUpdate(
        booking.slot._id,
        { $inc: { bookedCount: -1 } },
        { new: true }
      );
    }

    // Mark booking as cancelled
    booking.status = "CANCELLED";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking, // optional: return the updated booking
    });
  } catch (error) {
    next(error);
  }
};


export const getMyBookings = async (req, res, next) => {
  try {

    const bookings = await Booking.find({ user: req.user._id })
      .populate("temple", "name location image")
      .populate("slot", "date startTime endTime price capacity bookedCount")      
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: bookings.length,
      bookings
    });

  } catch (error) {
    next(error);
  }
};



export const verifyBookingQR = async (req, res, next) => {
  try {

    const { token } = req.query;

    const booking = await Booking.findOne({ qrToken: token })
      .populate("temple", "name location")
      .populate("slot", "date startTime endTime");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code"
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking cancelled"
      });
    }

    if (booking.isCheckedIn) {
      return res.status(400).json({
        success: false,
        message: "QR already used"
      });
    }

    /* QR EXPIRY LOGIC */

    const slotDate = new Date(booking.slot.date);

    const [endHour, endMinute] = booking.slot.endTime.split(":");

    slotDate.setHours(endHour, endMinute, 0, 0);

    const currentTime = new Date();

    if (currentTime > slotDate) {
      return res.status(400).json({
        success: false,
        message: "Slot expired. Entry not allowed."
      });
    }

    /* ALLOW ENTRY */

    booking.isCheckedIn = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Entry allowed",
      booking
    });

  } catch (error) {
    next(error);
  }
};








export const downloadTicket = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate("temple", "name location")
      .populate("slot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=darshan-ticket-${booking._id}.pdf`
    );

    doc.pipe(res);

    /* -------------------------------
       WATERMARK
    -------------------------------- */

    doc.save();

    doc
      .fontSize(70)
      .fillColor("#eeeeee")
      .opacity(0.3)
      .rotate(-30, { origin: [300, 400] })
      .text("TEMPLE DARSHAN", 100, 350);

    doc.restore();
    doc.opacity(1).fillColor("#000");

    /* -------------------------------
       HEADER
    -------------------------------- */

    doc
      .rect(0, 0, doc.page.width, 70)
      .fill("#FF9933");

    doc
      .fillColor("#fff")
      .fontSize(24)
      .text("Temple Darshan Ticket", 0, 25, {
        align: "center",
      });

    doc.moveDown(3);

    /* -------------------------------
       TEMPLE INFORMATION
    -------------------------------- */

    const templeBoxTop = doc.y;

    doc
      .rect(50, templeBoxTop, 500, 80)
      .stroke("#FF9933");

    doc
      .fontSize(16)
      .fillColor("#FF6600")
      .text("Temple Information", 60, templeBoxTop + 10);

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Temple Name: ${booking.temple?.name}`, 60, templeBoxTop + 35);

    doc.text(
      `Location: ${booking.temple?.location}`,
      60,
      templeBoxTop + 55
    );

    doc.moveDown(4);

    /* -------------------------------
       VISIT DETAILS
    -------------------------------- */

    const visitTop = doc.y;

    doc
      .rect(50, visitTop, 500, 100)
      .stroke("#FF9933");

    doc
      .fontSize(16)
      .fillColor("#FF6600")
      .text("Visit Details", 60, visitTop + 10);

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(
        `Visit Date: ${new Date(booking.visitDate).toDateString()}`,
        60,
        visitTop + 35
      );

    if (booking.slot) {
      doc.text(
        `Slot Timing: ${booking.slot.startTime} - ${booking.slot.endTime}`,
        60,
        visitTop + 55
      );
    }

    doc.text(`Total Persons: ${booking.persons}`, 60, visitTop + 75);
    doc.text(`Total Paid: ₹${booking.amount}`, 300, visitTop + 75);

    doc.moveDown(5);

    /* -------------------------------
       DEVOTEE DETAILS
    -------------------------------- */

    if (booking.devotees?.length) {
      doc
        .fontSize(16)
        .fillColor("#FF6600")
        .text("Devotee Details");

      doc.moveDown(0.5);

      doc.fillColor("#000").fontSize(12);

      booking.devotees.forEach((devotee, index) => {
        doc.text(`${index + 1}. ${devotee.name} (${devotee.age} yrs)`);
      });

      doc.moveDown();
    }

    /* -------------------------------
       QR TICKETS
    -------------------------------- */

    doc
      .fontSize(16)
      .fillColor("#FF6600")
      .text("Entry QR Tickets");

    doc.moveDown(1);

    doc.fillColor("#000");

    let x = 60;
    let y = doc.y;

    booking.tickets.forEach((ticket, index) => {
      doc.image(ticket.qrCode, x, y, { width: 110 });

      doc
        .fontSize(10)
        .text(`Person ${index + 1}`, x + 30, y + 115);

      x += 150;

      if (x > 420) {
        x = 60;
        y += 150;
      }
    });

    doc.moveDown(6);

    /* -------------------------------
       INSTRUCTIONS
    -------------------------------- */

    doc
      .fontSize(16)
      .fillColor("#FF6600")
      .text("Instructions");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor("#000")
      .text("• Show this QR code at temple entrance.");
    doc.text("• Each QR code is valid for one person.");
    doc.text("• QR codes become invalid after scanning.");
    doc.text("• Carry valid ID proof.");
    doc.text("• Arrive 30 minutes before slot time.");

    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("#777")
      .text(
        "This ticket is system generated. No signature required.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    next(error);
  }
};