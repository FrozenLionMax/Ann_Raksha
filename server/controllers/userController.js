const User = require("../models/User");
const Donation = require("../models/Donation");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let kpis = {};

    if (role === "ngo" || role === "receiver") {
      const availableDonations = await Donation.countDocuments({ status: "available" });
      const myClaimedDonations = await Donation.countDocuments({ claimedBy: userId, status: { $ne: "completed" } });
      const completedByMe = await Donation.countDocuments({ claimedBy: userId, status: "completed" });

      kpis = { availableDonations, myClaimedDonations, completedDonations: completedByMe };
    } else {
      const totalDonations = await Donation.countDocuments({ donorId: userId });
      const claimedDonations = await Donation.countDocuments({ donorId: userId, status: "matched" });
      const completedDonations = await Donation.countDocuments({ donorId: userId, status: "completed" });

      kpis = { totalDonations, claimedDonations, completedDonations };
    }

    const user = await User.findById(userId).select("points impactStats");
    kpis.points = user?.points || 0;
    kpis.impactStats = user?.impactStats || { mealsProvided: 0, co2Saved: 0, waterSaved: 0, totalDonations: 0 };

    const recentDonations = await Donation.find(
      role === "ngo" ? { status: "available" } : { donorId: userId }
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donorId", "name")
      .populate("claimedBy", "name");

    res.json({ kpis, recentDonations });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, organizationName, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (organizationName !== undefined) user.organizationName = organizationName;
    if (avatar) user.avatar = avatar;

    await user.save();

    const updated = user.toObject();
    delete updated.password;

    // Update localStorage info
    res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ points: { $gt: 0 } })
      .sort({ points: -1 })
      .limit(50)
      .select("name role points impactStats organizationName createdAt");

    res.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name role points impactStats organizationName bio avatar createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardData,
  updateProfile,
  getLeaderboard,
  getPublicProfile,
};
