const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createDonation,
  browseDonations,
  claimDonation,
  getMyDonations,
  completeDonation,
  updateDonationStatus,
  getDonationById,
} = require("../controllers/donationcontroller");

router.post("/create", protect, createDonation);
router.get("/all", protect, browseDonations);
router.get("/my-donations", protect, getMyDonations);
router.post("/claim/:id", protect, claimDonation);
router.put("/complete/:id", protect, completeDonation);
router.put("/status/:id", protect, updateDonationStatus);
router.get("/:id", protect, getDonationById);

module.exports = router;