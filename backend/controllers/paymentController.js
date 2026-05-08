import Payment from '../models/Payment.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Record or update payment
// @route   POST /api/payments
// @access  Private/Admin
const recordPayment = async (req, res) => {
  const { userId, totalAmount, paidAmount, pendingAmount, installments } = req.body;

  let payment = await Payment.findOne({ userId });

  if (payment) {
    payment.paidAmount += Number(paidAmount);
    payment.pendingAmount = totalAmount - payment.paidAmount;
    payment.installments.push({ amount: paidAmount, date: Date.now(), status: 'paid' });
    payment.status = payment.pendingAmount <= 0 ? 'paid' : 'partial';
    await payment.save();
  } else {
    payment = await Payment.create({
      userId,
      totalAmount,
      paidAmount,
      pendingAmount,
      installments: [{ amount: paidAmount, date: Date.now(), status: 'paid' }],
      status: pendingAmount <= 0 ? 'paid' : 'partial'
    });
  }

  await ActivityLog.create({
    userId: req.user._id,
    action: 'RECORD_PAYMENT',
    details: `Recorded payment of ${paidAmount} for user ID: ${userId}`,
  });

  res.status(201).json(payment);
};

// @desc    Get all payments (Admin) or single user payments (Student)
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  let payments;
  if (req.user.role === 'admin') {
    payments = await Payment.find({}).populate('userId', 'name email');
  } else {
    payments = await Payment.find({ userId: req.user._id });
  }
  res.json(payments);
};

export { recordPayment, getPayments };
