const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["donor", "receiver", "ngo", "volunteer", "admin"],
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    organizationName: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },

    verificationDocument: {
      type: String,
      default: "",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    points: {
      type: Number,
      default: 0,
    },

    impactStats: {
      mealsProvided: { type: Number, default: 0 },
      co2Saved: { type: Number, default: 0 }, // kg of CO2
      waterSaved: { type: Number, default: 0 }, // liters of water
      totalDonations: { type: Number, default: 0 }
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});

userSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

module.exports = mongoose.model(
  "User",
  userSchema
);