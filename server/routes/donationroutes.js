const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createDonation,
  getAllDonations,
  claimDonation,
  getMyDonations,
  completeDonation
} = require("../controllers/donationController");

router.post("/create", protect, createDonation);
router.get("/all", protect, getAllDonations);
router.post("/claim/:id", protect, claimDonation);
router.get("/my-donations", protect, getMyDonations);
router.put("/complete/:id", protect, completeDonation);

module.exports = router;