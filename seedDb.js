const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donation = require('./server/models/Donation');
const User = require('./server/models/User');

dotenv.config({ path: './server/.env' });

const seedDonations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/foodwaste");
    console.log('MongoDB connected');
    
    // 1. Get first donor and first ngo
    const donor = await User.findOne({ role: 'donor' });
    const ngo = await User.findOne({ role: 'ngo' });

    if (!donor) {
      console.log('No donor found! Create one via UI first.');
      process.exit(1);
    }

    console.log(`Using Donor: ${donor.email}`);
    
    // Clear existing for clean slate
    await Donation.deleteMany({ donorId: donor._id });
    console.log('Cleared existing donations for this donor');

    const donations = [
      {
        foodTitle: 'Excess Banquet Food',
        foodType: 'mixed',
        quantity: 45,
        servesPeople: 100,
        pickupAddress: '123 Banquet Hall, City Center',
        location: { lat: 20.59, lng: 78.96 },
        status: 'available',
        urgencyLevel: 'urgent',
        allergens: ['dairy', 'nuts'],
        donorId: donor._id,
        createdAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        foodTitle: 'Fresh Baked Bread',
        foodType: 'veg',
        quantity: 15,
        servesPeople: 30,
        pickupAddress: 'Sunrise Bakery, North Ave',
        location: { lat: 20.60, lng: 78.95 },
        status: 'available',
        urgencyLevel: 'high',
        allergens: ['gluten'],
        donorId: donor._id,
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        foodTitle: 'Packaged Sandwiches',
        foodType: 'non-veg',
        quantity: 20,
        servesPeople: 20,
        pickupAddress: 'Corporate Office Cafeteria',
        location: { lat: 20.58, lng: 78.97 },
        status: ngo ? 'matched' : 'available',
        claimedBy: ngo ? ngo._id : null,
        urgencyLevel: 'medium',
        allergens: [],
        donorId: donor._id,
        createdAt: new Date(Date.now() - 3600000 * 24)
      },
      {
        foodTitle: 'Surplus Event Catering',
        foodType: 'mixed',
        quantity: 150,
        servesPeople: 300,
        pickupAddress: 'Grand Convention Center',
        location: { lat: 20.55, lng: 78.90 },
        status: 'completed',
        claimedBy: ngo ? ngo._id : null,
        urgencyLevel: 'urgent',
        allergens: [],
        donorId: donor._id,
        createdAt: new Date(Date.now() - 3600000 * 48)
      }
    ];

    await Donation.insertMany(donations);
    console.log('Successfully inserted seed donations!');
    
    // Update impact stats for donor
    if (donor) {
      donor.impactStats = {
        mealsProvided: 300,
        co2Saved: 150,
        waterSaved: 5000,
        totalDonations: 4
      };
      await donor.save();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDonations();
