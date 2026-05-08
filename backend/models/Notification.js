import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'alert', 'reminder'],
      default: 'announcement',
    },
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isGlobal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
