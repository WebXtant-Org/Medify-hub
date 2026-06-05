import mongoose from 'mongoose';

const materialFolderSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    folderName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate folder names for the same course
materialFolderSchema.index({ courseId: 1, folderName: 1 }, { unique: true });

const MaterialFolder = mongoose.model('MaterialFolder', materialFolderSchema);

export default MaterialFolder;
