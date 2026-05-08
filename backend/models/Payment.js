import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    installments: [
      {
        amount: Number,
        date: Date,
        status: {
          type: String,
          enum: ['paid', 'pending'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['paid', 'partial', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
