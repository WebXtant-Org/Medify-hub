import mongoose from 'mongoose';

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
        marks: {
          type: Number,
          default: 1,
        },
      },
    ],
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model('Test', testSchema);

export default Test;
