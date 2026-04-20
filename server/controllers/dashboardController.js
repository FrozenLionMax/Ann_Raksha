const Donation = require("../models/Donation");

const getDashboardStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();

    const availableDonations = await Donation.countDocuments({
      status: "available",
    });

    const claimedDonations = await Donation.countDocuments({
      status: "claimed",
    });

    const completedDonations = await Donation.countDocuments({
      status: "completed",
    });

    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donorId", "name organizationName");

    res.json({
      totalDonations,
      availableDonations,
      claimedDonations,
      completedDonations,
      recentDonations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Dashboard fetch failed",
    });
  }
};

module.exports = {
  getDashboardStats,
};