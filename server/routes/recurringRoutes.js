const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRecurring, getMyRecurring, toggleRecurring, deleteRecurring } = require('../controllers/recurringController');

router.post('/create', protect, createRecurring);
router.get('/my', protect, getMyRecurring);
router.put('/toggle/:id', protect, toggleRecurring);
router.delete('/:id', protect, deleteRecurring);

module.exports = router;
