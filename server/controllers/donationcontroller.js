const Donation = require("../models/Donation");

const {
  createNotification,
} = require("../services/notificationService");
const socketio = require("../socket");

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
      location,
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
      location,
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

    donation.status = "matched";
    donation.claimedBy = req.user._id;

    await donation.save();

    await createNotification(
      donation.donorId,
      "Donation Claimed",
      "Someone has claimed your donation.",
      "claim"
    );

    // Emit real-time socket event to all clients (in a real app, emit to specific donorId room)
    const io = socketio.getIO();
    io.emit('status_update', { donationId: donation._id, status: 'matched', title: donation.foodTitle });

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

    const io = socketio.getIO();
    io.emit('status_update', { donationId: donation._id, status: 'completed', title: donation.foodTitle });

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

const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Not found" });
    
    donation.status = status;
    await donation.save();

    await createNotification(
      donation.donorId,
      "Status Update",
      `Your donation is now ${status}.`,
      "status_update"
    );

    const io = socketio.getIO();
    io.emit('status_update', { donationId: donation._id, status, title: donation.foodTitle });

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  browseDonations,
  claimDonation,
  completeDonation,
  updateDonationStatus,
};