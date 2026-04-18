const Donation = require("../models/Donation");

exports.createDonation = async (req, res) => {
  try {
    const {
      foodTitle,
      foodType,
      quantity,
      servesPeople,
      cookedTime,
      expiryTime,
      pickupAddress,
      urgencyLevel
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
      urgencyLevel
    });

    res.status(201).json({
      message: "Donation created successfully",
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donorId", "name email phone organizationName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: donations.length,
      donations
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    if (donation.status !== "available") {
      return res.status(400).json({
        message: "Donation already claimed"
      });
    }

    donation.status = "claimed";
    donation.claimedBy = req.user._id;

    await donation.save();

    res.status(200).json({
      message: "Donation claimed successfully",
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: donations.length,
      donations
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    donation.status = "completed";

    await donation.save();

    res.status(200).json({
      message: "Donation marked as completed",
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};