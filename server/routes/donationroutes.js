const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createDonation,
  browseDonations,  // ✅ Changed from getAllDonations
  claimDonation,
  getMyDonations,
  completeDonation,
  updateDonationStatus
} = require("../controllers/donationController");

router.post("/create", protect, createDonation);
router.get("/all", protect, browseDonations);  // ✅ Changed from getAllDonations
router.post("/claim/:id", protect, claimDonation);
router.get("/my-donations", protect, getMyDonations);
router.put("/complete/:id", protect, completeDonation);
router.put("/status/:id", protect, updateDonationStatus);

module.exports = router;