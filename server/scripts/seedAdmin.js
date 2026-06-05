const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ email: "admin@foodflow.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const adminUser = new User({
      name: "Super Admin",
      email: "admin@foodflow.com",
      password: "adminpassword123", // Will be hashed by pre-save hook
      role: "admin",
      verificationStatus: "approved"
    });

    await adminUser.save();
    console.log("Admin user seeded successfully. Login with admin@foodflow.com / adminpassword123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
