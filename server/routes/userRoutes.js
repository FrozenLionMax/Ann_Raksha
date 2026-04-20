const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardData,
  updateProfile,
  getLeaderboard,
  getPublicProfile,
} = require("../controllers/userController");

router.get("/dashboard", protect, getDashboardData);
router.put("/profile", protect, updateProfile);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/profile/:id", protect, getPublicProfile);

module.exports = router;
