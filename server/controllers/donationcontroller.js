const Donation = require("../models/Donation");

const {
  createNotification,
} = require("../services/notificationService");

const createDonation = async (req, res) => {
  try {
    const {
      foodTitle,
      foodType,
      quantity,
      servesPeople,
      cookedTime,
      expiryTime,
      pickupAddress,
      urgencyLevel,
    } = req.body;

    const donation = await Donation.create({
      donorId: req.user._id,
      foodTitle,
      foodType,
      quantity,
      servesPeople,
      cookedTime,
      expiryTime,
      pickupAddress,
      urgencyLevel,
      status: "available",
    });

    await createNotification(
      req.user._id,
      "Donation Created",
      "Your food donation was successfully posted.",
      "donation"
    );

    res.status(201).json(donation);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create donation",
    });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donations",
    });
  }
};

const browseDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      status: "available",
    }).sort({
      createdAt: -1,
    });

    res.json({
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donations",
    });
  }
};

const claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(
      req.params.id
    );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    if (donation.status !== "available") {
      return res.status(400).json({
        message: "Donation already claimed",
      });
    }

    donation.status = "claimed";
    donation.claimedBy = req.user._id;

    await donation.save();

    await createNotification(
      donation.donorId,
      "Donation Claimed",
      "Someone has claimed your donation.",
      "claim"
    );

    res.json({
      message: "Donation claimed successfully",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to claim donation",
    });
  }
};

const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(
      req.params.id
    );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    donation.status = "completed";

    await donation.save();

    await createNotification(
      donation.donorId,
      "Donation Completed",
      "Your donation was marked as completed.",
      "complete"
    );

    res.json({
      message: "Donation completed successfully",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete donation",
    });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  browseDonations,
  claimDonation,
  completeDonation,
};