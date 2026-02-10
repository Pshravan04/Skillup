const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const { sendStudentPaymentConfirmation, sendInstructorPaymentNotification } = require('../services/emailService');

// @desc    Process demo payment (no Stripe card required)
// @route   POST /api/payments/process
// @access  Private/Student
const processPayment = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId).populate('instructor', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if student is already enrolled
  if (course.enrolledStudents.includes(req.user._id)) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({
    student: req.user._id,
    course: courseId,
    status: 'completed'
  });

  if (existingPayment) {
    res.status(400);
    throw new Error('Payment already processed for this course');
  }

  // Create demo transaction ID
  const transactionId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create payment record
  const payment = await Payment.create({
    student: req.user._id,
    course: courseId,
    amount: course.price,
    transactionId: transactionId,
    paymentMethod: 'demo',
    status: 'completed',
  });

  // Enroll student in course
  course.enrolledStudents.push(req.user._id);
  await course.save();

  // Send emails to both student and instructor
  try {
    // Send confirmation email to student
    await sendStudentPaymentConfirmation(
      req.user.email,
      req.user.name,
      course.title,
      course.price,
      course._id
    );

    // Send notification email to instructor
    await sendInstructorPaymentNotification(
      course.instructor.email,
      course.instructor.name,
      req.user.name,
      course.title,
      course.price
    );

    console.log('✅ Payment emails sent successfully');
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError);
    // Don't fail the payment if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Payment processed successfully! Check your email for confirmation.',
    payment: {
      _id: payment._id,
      amount: payment.amount,
      transactionId: payment.transactionId,
      course: {
        _id: course._id,
        title: course.title
      }
    }
  });
});

// @desc    Get payment history for student
// @route   GET /api/payments/my-payments
// @access  Private/Student
const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ student: req.user._id })
    .populate('course', 'title thumbnail')
    .sort('-createdAt');

  res.json(payments);
});

module.exports = {
  processPayment,
  getMyPayments,
};
