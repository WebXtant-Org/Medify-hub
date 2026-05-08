import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    personalEmail: {
      type: String,
    },
    feesStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending',
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'hold', 'terminated'],
      default: 'active',
    },
    specialty: {
      type: String,
    },
    salary: {
      type: Number,
    },
    courseIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    deviceId: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
