import mongoose from 'mongoose';

const achieverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  achievement: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Achiever = mongoose.model('Achiever', achieverSchema);
export default Achiever;
