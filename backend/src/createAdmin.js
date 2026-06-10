require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    const adminExists = await User.findOne({ email: 'admin@petray.com' });
    if (adminExists) {
      console.log('Admin user already exists (admin@petray.com).');
      process.exit(0);
    }

    await User.create({
      name: 'System Admin',
      email: 'admin@petray.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@petray.com');
    console.log('Password: adminpassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
