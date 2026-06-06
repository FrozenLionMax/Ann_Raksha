const Donation = require("../models/Donation");
const User = require("../models/User");

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
    const filter = req.user.role === 'ngo' 
      ? { claimedBy: req.user._id } 
      : { donorId: req.user._id };
      
    const donations = await Donation.find(filter).sort({
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

    // Gamification & Impact Tracking: Update donor's points and impact stats
    const donor = await User.findById(donation.donorId);
    if (donor) {
      // Points calculation based on quantity and urgency
      const basePoints = (donation.quantity || 1) * 10;
      const urgencyMultiplier = donation.urgencyLevel === "critical" ? 2 : donation.urgencyLevel === "high" ? 1.5 : 1;
      const pointsEarned = Math.round(basePoints * urgencyMultiplier);

      // Impact estimations
      const mealsProvided = donation.servesPeople || Math.round((donation.quantity || 1) * 3);
      const co2Saved = (donation.quantity || 1) * 2.5; // Approx 2.5kg CO2 saved per kg of food
      const waterSaved = (donation.quantity || 1) * 1000; // Approx 1000L water saved per kg of food

      donor.points = (donor.points || 0) + pointsEarned;
      if (!donor.impactStats) {
        donor.impactStats = { mealsProvided: 0, co2Saved: 0, waterSaved: 0, totalDonations: 0 };
      }
      donor.impactStats.mealsProvided += mealsProvided;
      donor.impactStats.co2Saved += co2Saved;
      donor.impactStats.waterSaved += waterSaved;
      donor.impactStats.totalDonations += 1;

      await donor.save();
    }

    await createNotification(
      donation.donorId,
      "Donation Completed",
      `Your donation was marked as completed. You earned points for your impact!`,
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

const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  browseDonations,
  claimDonation,
  completeDonation,
  updateDonationStatus,
  getDonationById,
};