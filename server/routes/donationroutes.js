const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validate, donationSchema } = require("../middleware/validate");
const { upload, uploadToCloudinary } = require("../middleware/upload");
const { generateDonationQR, verifyQRData } = require("../services/qrService");
const Donation = require("../models/Donation");
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

// #4 Image upload for donations
router.post("/upload-image", protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    const result = await uploadToCloudinary(req.file.buffer, 'ann-raksha/donations');
    res.json({ url: result.url, public_id: result.public_id });
  } catch (e) {
    res.status(500).json({ message: 'Image upload failed: ' + e.message });
  }
});

// #9 QR Code generation
router.get("/:id/qr", protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'name');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    const qrDataUrl = await generateDonationQR(donation._id, donation.donorId?.name, donation.foodTitle);
    donation.qrCode = qrDataUrl;
    await donation.save();
    res.json({ qrCode: qrDataUrl });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// #9 QR Verification
router.put("/:id/verify-qr", protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    donation.pickupVerified = true;
    donation.pickupVerifiedAt = new Date();
    await donation.save();
    res.json({ message: 'Pickup verified successfully', verified: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// #7 Proximity search
router.get("/nearby", protect, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng are required' });
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    // Approx conversion: 1 degree = 111km
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(latNum * Math.PI / 180));

    const donations = await Donation.find({
      status: 'available',
      'location.lat': { $gte: latNum - latDelta, $lte: latNum + latDelta },
      'location.lng': { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta },
    }).populate('donorId', 'name email phone organizationName').sort({ createdAt: -1 });

    // Calculate distance and sort
    const withDistance = donations.map(d => {
      const dLat = (d.location.lat - latNum) * Math.PI / 180;
      const dLng = (d.location.lng - lngNum) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(latNum * Math.PI / 180) * Math.cos(d.location.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = 6371 * c;
      return { ...d.toObject(), distanceKm: Math.round(dist * 10) / 10 };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ donations: withDistance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Must be last (catch-all param)
router.get("/:id", protect, getDonationById);

module.exports = router;