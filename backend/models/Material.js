import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['PDF', 'Video', 'Document'],
      default: 'PDF',
    },
    folder: {
      type: String,
      default: 'General',
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaterialFolder',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    assignedUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model('Material', materialSchema);

export default Material;
