import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
