import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: String,
        isCorrect: Boolean,
      },
    ],
    status: {
      type: String,
      enum: ['passed', 'failed'],
      default: 'passed',
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('Result', resultSchema);

export default Result;
