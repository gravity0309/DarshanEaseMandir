import { User } from "../models/user.model.js";
import { Temple } from "../models/temple.model.js";
import { Booking } from "../models/booking.model.js";
import { Donation } from "../models/donation.model.js";

/*
   GET /api/v1/admin/dashboard
   ADMIN
*/
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTemples = await Temple.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const donationAgg = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalDonationAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalDonations =
      donationAgg.length > 0 ? donationAgg[0].totalDonationAmount : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalTemples,
        totalBookings,
        totalDonations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
   GET /api/v1/admin/temple-stats
   ADMIN
*/
const getTempleStats = async (req, res, next) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$temple",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
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
          totalBookings: 1,
          totalRevenue: 1,
        },
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

export const updateUserRole = async (req, res, next) => {
  try {
    // const { role } = req.body;
    const role = req.body.role?.toUpperCase();

    // Allow only USER and ORGANIZER roles
    if (!["USER", "ORGANIZER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only USER or ORGANIZER allowed.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent modifying ADMIN accounts
    if (user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify ADMIN role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//api to get all users for admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};




const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .populate("slot");

    res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};



const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .populate("temple", "name");

    res.status(200).json({
      success: true,
      total: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

 const getTempleRevenue = async (req, res, next) => {
  try {

    const revenue = await Booking.aggregate([

      {
        $match: { status: "CONFIRMED" }
      },

      {
        $group: {
          _id: "$temple",
          totalRevenue: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
          totalVisitors: { $sum: "$persons" }
        }
      },

      {
        $lookup: {
          from: "temples",
          localField: "_id",
          foreignField: "_id",
          as: "temple"
        }
      },

      {
        $unwind: "$temple"
      },

      {
        $project: {
          _id: 0,
          templeId: "$temple._id",
          templeName: "$temple.name",
          location: "$temple.location",
          totalRevenue: 1,
          totalBookings: 1,
          totalVisitors: 1
        }
      },

      {
        $sort: { totalRevenue: -1 }
      }

    ]);

    res.status(200).json({
      success: true,
      revenue
    });

  } catch (error) {
    next(error);
  }
};
export {  getDashboardAnalytics,
  getTempleStats,
  
  getAllUsers,
  getAllBookings,
  getAllDonations,
  getTempleRevenue
 
  
  };