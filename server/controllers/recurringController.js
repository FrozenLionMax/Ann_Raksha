const RecurringDonation = require('../models/RecurringDonation');
const Donation = require('../models/Donation');

function calcNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'daily': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'biweekly': return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    case 'monthly': return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    default: return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}

const createRecurring = async (req, res) => {
  try {
    const { template, frequency } = req.body;
    if (!template?.foodTitle || !frequency) return res.status(400).json({ message: 'Template and frequency required' });

    const recurring = await RecurringDonation.create({
      donorId: req.user._id,
      template,
      frequency,
      nextRun: calcNextRun(frequency),
    });
    res.status(201).json(recurring);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getMyRecurring = async (req, res) => {
  try {
    const schedules = await RecurringDonation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.json(schedules);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const toggleRecurring = async (req, res) => {
  try {
    const schedule = await RecurringDonation.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    if (schedule.donorId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    schedule.isActive = !schedule.isActive;
    if (schedule.isActive) schedule.nextRun = calcNextRun(schedule.frequency);
    await schedule.save();
    res.json(schedule);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteRecurring = async (req, res) => {
  try {
    const schedule = await RecurringDonation.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Not found' });
    if (schedule.donorId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await schedule.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Called internally on a timer
async function processRecurring() {
  try {
    const now = new Date();
    const due = await RecurringDonation.find({ isActive: true, nextRun: { $lte: now } });
    for (const schedule of due) {
      const t = schedule.template;
      await Donation.create({
        donorId: schedule.donorId,
        foodTitle: t.foodTitle,
        foodType: t.foodType,
        quantity: t.quantity,
        servesPeople: t.servesPeople,
        pickupAddress: t.pickupAddress,
        location: t.location,
        urgencyLevel: t.urgencyLevel || 'normal',
        description: t.description || `Auto-created from recurring schedule`,
        contactPhone: t.contactPhone || '',
        cookedTime: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        status: 'available',
      });
      schedule.lastRun = now;
      schedule.runCount += 1;
      schedule.nextRun = calcNextRun(schedule.frequency);
      await schedule.save();
      console.log(`🔄 Auto-created donation: ${t.foodTitle} (run #${schedule.runCount})`);
    }
    if (due.length > 0) console.log(`🔄 Processed ${due.length} recurring donations`);
  } catch (e) {
    console.error('Recurring process error:', e.message);
  }
}

module.exports = { createRecurring, getMyRecurring, toggleRecurring, deleteRecurring, processRecurring };
