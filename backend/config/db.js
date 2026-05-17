import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Batch from '../models/Batch.js';

const seedDefaultBatches = async () => {
  try {
    const course = await Course.findOne({});
    const faculty = await User.findOne({ role: 'faculty' }) || await User.findOne({ role: 'admin' });

    if (!course || !faculty) {
      console.log('Cannot seed default batches: Course or Faculty/Admin not found yet');
      return;
    }

    const morningExists = await Batch.findOne({ name: 'Morning Batch' });
    if (!morningExists) {
      await Batch.create({
        name: 'Morning Batch',
        timing: '09:00 AM - 01:00 PM',
        courseId: course._id,
        facultyId: faculty._id
      });
      console.log('Seeded Morning Batch successfully!');
    }

    const afternoonExists = await Batch.findOne({ name: 'Afternoon Batch' });
    if (!afternoonExists) {
      await Batch.create({
        name: 'Afternoon Batch',
        timing: '02:00 PM - 06:00 PM',
        courseId: course._id,
        facultyId: faculty._id
      });
      console.log('Seeded Afternoon Batch successfully!');
    }
  } catch (error) {
    console.error('Error seeding default batches:', error);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultBatches();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
