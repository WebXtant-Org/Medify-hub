import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived', 'Active', 'Draft', 'Archived'],
      default: 'active',
    },
    fullDescription: String,
    highlights: [String],
    focusAreas: [String],
    details: {
      duration: String,
      eligibility: String,
      curriculum: [String],
      careerPath: String,
    },
    examOverview: {
      duration: String,
      pattern: String,
      passingScore: String,
      subjects: [String],
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

const Course = mongoose.model('Course', courseSchema);

export default Course;
