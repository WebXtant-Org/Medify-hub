import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}));

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find({});
    console.log('Current Courses in DB:');
    courses.forEach(c => console.log(`${c._id} - ${c.title}`));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCourses();
