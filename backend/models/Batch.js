import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    timing: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentIds: [
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

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
