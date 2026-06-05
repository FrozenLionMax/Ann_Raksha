const User = require('../models/User');
const Donation = require('../models/Donation');

// Get all NGOs
exports.getNgos = async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('-password');
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching NGOs' });
  }
};

// Approve or reject NGO
exports.updateNgoStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ngo = await User.findById(id);
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ message: 'NGO not found' });
    }

    ngo.verificationStatus = status;
    if (status === 'rejected') {
      ngo.rejectionReason = reason || 'No reason provided';
    } else {
      ngo.rejectionReason = '';
    }

    await ngo.save();
    res.json({ message: `NGO ${status} successfully`, ngo });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating NGO status' });
  }
};

// Get high-level stats for admin dashboard
exports.getAdminStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNgos = await User.countDocuments({ role: 'ngo' });
    const verifiedNgos = await User.countDocuments({ role: 'ngo', verificationStatus: 'approved' });
    
    const totalDonations = await Donation.countDocuments();
    const activeDonations = await Donation.countDocuments({ status: 'available' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });

    res.json({
      users: { totalDonors, totalNgos, verifiedNgos },
      donations: { totalDonations, activeDonations, completedDonations }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching admin stats' });
  }
};
