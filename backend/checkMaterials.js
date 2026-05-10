import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const MaterialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  courseId: mongoose.Schema.Types.ObjectId
});

const Material = mongoose.model('Material', MaterialSchema);

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const materials = await Material.find({});
  console.log('Materials in DB:');
  materials.forEach(m => {
    console.log(`- ${m.title}: ${m.fileUrl}`);
  });
  await mongoose.connection.close();
}

check();
