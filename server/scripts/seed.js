import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Driver.deleteMany({});

    // Create admin user
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✓ Admin user created (username: admin, password: admin123)');

    // Create sample drivers
    const drivers = [
      { name: 'Rajesh Kumar', phone: '+919876543210', licensePlate: 'DL-01-AB-1234', status: 'available', location: { lat: 28.6139, lng: 77.2090 } },
      { name: 'Priya Sharma', phone: '+919876543211', licensePlate: 'DL-02-CD-5678', status: 'available', location: { lat: 28.7041, lng: 77.1025 } },
      { name: 'Amit Patel', phone: '+919876543212', licensePlate: 'DL-03-EF-9012', status: 'offline', location: { lat: 28.5355, lng: 77.3910 } }
    ];

    await Driver.insertMany(drivers);
    console.log('✓ Sample drivers created');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
