const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }], // For MCQ
  correctAnswer: { type: String }, // For MCQ
  questionType: {
    type: String,
    enum: ['mcq', 'subjective'],
    required: true,
  },
  points: { type: Number, required: true },
});

const examSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    questions: [questionSchema],
    duration: {
      type: Number, // In minutes
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    passingScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
