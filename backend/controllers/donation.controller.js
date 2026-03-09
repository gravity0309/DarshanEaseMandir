import { Donation } from "../models/donation.model.js";
import { Temple } from "../models/temple.model.js";
import PDFDocument from "pdfkit";


const createDonation = async (req, res, next) => {
  try {
    const { templeId, amount } = req.body;

    if (!templeId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Temple and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Donation amount must be greater than 0",
      });
    }

    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    const receiptNumber =
      "DON-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const donation = await Donation.create({
      user: req.user._id,
      temple: templeId,
      amount,
      receiptNumber,
    });

    res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    next(error);
  }
};


const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate("temple", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};
/*
   GET ALL DONATIONS
   GET /api/v1/donations
   ADMIN
*/
const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

/*
   GET DONATION STATS PER TEMPLE
   GET /api/v1/donations/stats
   ADMIN
*/
const getDonationStats = async (req, res, next) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: "$temple",
          totalAmount: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "temples",
          localField: "_id",
          foreignField: "_id",
          as: "templeInfo",
        },
      },
      { $unwind: "$templeInfo" },
      {
        $project: {
          templeName: "$templeInfo.name",
          totalAmount: 1,
          totalDonations: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
const downloadDonationReceipt = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("user", "name email")
      .populate("temple", "name location");

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=donation-${donation.receiptNumber}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Temple Donation Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Receipt No: ${donation.receiptNumber}`);
    doc.text(`Donor Name: ${donation.user.name}`);
    doc.text(`Temple: ${donation.temple.name}`);
    doc.text(`Location: ${donation.temple.location}`);
    doc.text(`Amount: ₹${donation.amount}`);
    doc.text(
      `Date: ${new Date(donation.createdAt).toLocaleDateString()}`
    );

    doc.moveDown();
    doc.text("Thank you for your generous donation!", { align: "center" });

    doc.end();
  } catch (error) {
    next(error);
  }
};



export {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonationStats,
  downloadDonationReceipt
};