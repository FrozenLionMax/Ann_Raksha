const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    foodTitle: {
      type: String,
      required: true
    },

    foodType: {
      type: String,
      required: true
    },

    quantity: {
      type: String,
      required: true
    },

    servesPeople: {
      type: Number,
      required: true
    },

    cookedTime: {
      type: String,
      required: true
    },

    expiryTime: {
      type: String,
      required: true
    },

    pickupAddress: {
      type: String,
      required: true
    },

    urgencyLevel: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal"
    },

    status: {
      type: String,
      enum: ["available", "claimed", "completed"],
      default: "available"
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Donation", donationSchema);