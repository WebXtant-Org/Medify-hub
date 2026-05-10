import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = 'medifyhubhealthcaresolution@gmail.com';
    const password = 'Boomika@2331';
    const name = 'Medify Hub Admin';

    let user = await User.findOne({ email });

    if (user) {
      user.password = password;
      user.role = 'admin';
      user.name = name;
      await user.save();
      console.log('Admin user updated successfully!');
    } else {
      await User.create({
        name,
        email,
        password,
        role: 'admin',
        status: 'active'
      });
      console.log('Admin user created successfully!');
    }

    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
