const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { exportDonationsCSV, exportImpactReport } = require('../controllers/exportController');

router.get('/donations/csv', protect, exportDonationsCSV);
router.get('/impact', protect, exportImpactReport);

module.exports = router;
