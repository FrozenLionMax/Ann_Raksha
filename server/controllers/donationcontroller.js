const Donation = require("../models/Donation");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");
const socketio = require("../socket");
const { sendDonationClaimedEmail, sendDonationCompletedEmail } = require("../services/emailService");

const createDonation = async (req, res) => {
  try {
    const {
      foodTitle, foodType, quantity, servesPeople,
      cookedTime, expiryTime, pickupAddress, location,
      urgencyLevel, description, contactPhone, foodImage,
    } = req.body;

    const donation = await Donation.create({
      donorId: req.user._id,
      foodTitle, foodType, quantity, servesPeople,
      cookedTime, expiryTime, pickupAddress, location,
      urgencyLevel, description, contactPhone, foodImage,
      status: "available",
    });

    await createNotification(
      req.user._id,
      "Donation Created",
      "Your food donation was successfully posted.",
      "donation"
    );

    const io = socketio.getIO();
    io.emit("new_donation", { donation });

    res.status(201).json(donation);
  } catch (error) {
    console.error("Create donation error:", error);
    res.status(500).json({ message: "Failed to create donation" });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const filter = req.user.role === "ngo" || req.user.role === "receiver"
      ? { claimedBy: req.user._id }
      : { donorId: req.user._id };

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone organizationName")
      .populate("claimedBy", "name email phone organizationName");

    res.json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

const browseDonations = async (req, res) => {
  try {
    const { search, foodType, urgencyLevel } = req.query;
    const filter = { status: "available" };

    if (search) {
      filter.foodTitle = { $regex: search, $options: "i" };
    }
    if (foodType && foodType !== "all") {
      filter.foodType = foodType;
    }
    if (urgencyLevel && urgencyLevel !== "all") {
      filter.urgencyLevel = urgencyLevel;
    }

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone organizationName");

    res.json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

const claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    if (donation.status !== "available") {
      return res.status(400).json({ message: "Donation already claimed" });
    }

    donation.status = "matched";
    donation.claimedBy = req.user._id;
    await donation.save();

    await createNotification(
      donation.donorId,
      "Donation Claimed",
      `Your donation "${donation.foodTitle}" has been claimed!`,
      "claim"
    );

    const io = socketio.getIO();
    io.emit("status_update", {
      donationId: donation._id,
      status: "matched",
      title: donation.foodTitle,
    });

    // Send email notification
    try {
      const donor = await User.findById(donation.donorId);
      if (donor?.email && donor.notificationPrefs?.donationClaimed !== false) {
        sendDonationClaimedEmail(donor.email, donor.name, donation.foodTitle, req.user.name || 'An NGO');
      }
    } catch {}

    res.json({ message: "Donation claimed successfully", donation });
  } catch (error) {
    res.status(500).json({ message: "Failed to claim donation" });
  }
};

const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.status = "completed";
    await donation.save();

    // Gamification & Impact Tracking
    const donor = await User.findById(donation.donorId);
    if (donor) {
      const qty = parseFloat(donation.quantity) || 1;
      const basePoints = qty * 10;
      const urgencyMultiplier = donation.urgencyLevel === "urgent" ? 2 : 1;
      const pointsEarned = Math.round(basePoints * urgencyMultiplier);

      const mealsProvided = donation.servesPeople || Math.round(qty * 3);
      const co2Saved = qty * 2.5;
      const waterSaved = qty * 1000;

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
      `Your donation "${donation.foodTitle}" was completed. You earned impact points!`,
      "complete"
    );

    const io = socketio.getIO();
    io.emit("status_update", {
      donationId: donation._id,
      status: "completed",
      title: donation.foodTitle,
    });

    // Send completion email
    try {
      if (donor?.email && donor.notificationPrefs?.donationCompleted !== false) {
        sendDonationCompletedEmail(donor.email, donor.name, donation.foodTitle, mealsProvided, co2Saved);
      }
    } catch {}

    res.json({ message: "Donation completed successfully", donation });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete donation" });
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
      `Your donation "${donation.foodTitle}" is now ${status}.`,
      "status_update"
    );

    const io = socketio.getIO();
    io.emit("status_update", {
      donationId: donation._id,
      status,
      title: donation.foodTitle,
    });

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donorId", "name email phone organizationName")
      .populate("claimedBy", "name email phone organizationName");

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