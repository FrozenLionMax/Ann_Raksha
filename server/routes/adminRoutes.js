const express = require('express');
const router = express.Router();
const { getNgos, updateNgoStatus, getAdminStats } = require('../controllers/adminController');

// TODO: Add protect & admin middleware for security
router.get('/ngos', getNgos);
router.put('/ngos/:id/status', updateNgoStatus);
router.get('/stats', getAdminStats);

module.exports = router;
