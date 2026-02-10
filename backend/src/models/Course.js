const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Text content or description
  videoUrl: { type: String }, // URL to video lecture
  duration: { type: Number }, // Duration in minutes
});

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    thumbnail: {
      type: String, // URL to thumbnail image
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    originalPrice: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    gradientTheme: {
      type: String,
      enum: ['orange', 'blue', 'red', 'purple', 'teal'],
      default: 'blue',
    },
    lessons: [lessonSchema],
    enrolledStudents: [
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

module.exports = Course;
