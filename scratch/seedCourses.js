import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  assignedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const coursesData = [
    {
        title: "Basic Medical Coding Training (BMCT)",
        description: "Start Your Career in Medical Coding from Scratch. Designed for beginners to build strong foundational knowledge.",
        duration: "45 Days",
        price: 15000,
    },
    {
        title: "Advanced Medical Coding Training (AMCT)",
        description: "Upgrade Your Coding Knowledge to Industry Level. Designed to strengthen coding expertise beyond basic certification.",
        duration: "60 Days",
        price: 25000,
    },
    {
        title: "Certified Professional Coder (CPC)",
        description: "Build Your Career in the Global Healthcare Industry. Become a Globally Recognized Medical Coding Professional.",
        duration: "30 Days",
        price: 35000,
    },
    {
        title: "Certified Coding Specialist (CCS)",
        description: "Master Inpatient & Advanced Coding Skills. Become a Hospital Coding Specialist.",
        duration: "4-6 Months",
        price: 40000,
    },
    {
        title: "Certified Risk adjustment Coder (CRC)",
        description: "Build Your Career in Risk Adjustment & HCC Coding. Become a Risk Adjustment Coding Expert.",
        duration: "3 Months",
        price: 30000,
    },
    {
        title: "UAE Medical Coding Course",
        description: "Specially designed for students who want to build a career in the healthcare industry of the United Arab Emirates.",
        duration: "3-6 Months",
        price: 45000,
    }
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove current courses (optional, but requested to "vainga" which sounds like restoring)
    // Actually I'll just add them if they don't exist
    for (const course of coursesData) {
      const exists = await Course.findOne({ title: course.title });
      if (!exists) {
        await Course.create(course);
        console.log(`Added: ${course.title}`);
      } else {
        console.log(`Exists: ${course.title}`);
      }
    }

    console.log('Seeding completed');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedCourses();
