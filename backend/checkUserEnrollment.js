import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  studentId: String,
  courseIds: [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model('User', UserSchema);

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ studentId: 'MHHSGEN002' });
  if (user) {
    console.log(`User found: ${user.name}`);
    console.log(`Course IDs: ${user.courseIds}`);
  } else {
    console.log('User MHHSGEN002 not found.');
  }
  await mongoose.connection.close();
}

check();
