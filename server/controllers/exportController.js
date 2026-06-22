const Donation = require('../models/Donation');
const User = require('../models/User');

// GET /api/export/donations/csv
const exportDonationsCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let query = {};
    if (role === 'ngo' || role === 'receiver') query = { claimedBy: userId };
    else if (role !== 'admin') query = { donorId: userId };

    const donations = await Donation.find(query).sort({ createdAt: -1 }).lean();

    const headers = 'Food Title,Type,Quantity,Serves People,Status,Urgency,Pickup Address,Created Date\n';
    const rows = donations.map(d =>
      `"${d.foodTitle}","${d.foodType}","${d.quantity}","${d.servesPeople}","${d.status}","${d.urgencyLevel}","${d.pickupAddress.replace(/"/g, '""')}","${new Date(d.createdAt).toLocaleDateString()}"`
    ).join('\n');

    const csv = headers + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=AnnRaksha_Donations.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/export/impact
const exportImpactReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 }).lean();
    const completed = donations.filter(d => d.status === 'completed');

    const report = {
      reportDate: new Date().toISOString(),
      platform: 'Ann Raksha - Food Rescue Platform',
      user: { name: user.name, email: user.email, role: user.role, memberSince: user.createdAt },
      summary: {
        totalDonations: donations.length,
        completedDonations: completed.length,
        activeDonations: donations.filter(d => d.status === 'available').length,
        points: user.points,
      },
      environmentalImpact: {
        mealsProvided: user.impactStats?.mealsProvided || 0,
        co2SavedKg: user.impactStats?.co2Saved || 0,
        waterSavedLiters: user.impactStats?.waterSaved || 0,
        carbonCredits: ((user.impactStats?.co2Saved || 0) / 1000).toFixed(4),
        treesEquivalent: Math.round((user.impactStats?.co2Saved || 0) / 22),
      },
      donations: donations.map(d => ({
        title: d.foodTitle,
        type: d.foodType,
        quantity: d.quantity,
        serves: d.servesPeople,
        status: d.status,
        urgency: d.urgencyLevel,
        address: d.pickupAddress,
        created: d.createdAt,
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=AnnRaksha_Impact_Report.json');
    res.json(report);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { exportDonationsCSV, exportImpactReport };
