import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const adminUser = {
      name: 'System Admin',
      email: 'admin@medify.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    };

    await User.create(adminUser);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
