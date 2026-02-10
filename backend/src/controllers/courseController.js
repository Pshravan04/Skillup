const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate('instructor', 'name email');
  res.json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category, level, thumbnail } = req.body;

  const course = new Course({
    instructor: req.user._id,
    title,
    description,
    price,
    category,
    level,
    thumbnail,
    lessons: [],
  });

  const createdCourse = await course.save();

  // Auto-generate a sample MCQ exam for the course
  try {
    const Exam = require('../models/Exam');

    // Generate sample questions based on course topic
    const sampleQuestions = generateSampleQuestions(title, category, level);

    const autoExam = await Exam.create({
      title: `${title} - Assessment Exam`,
      course: createdCourse._id,
      questions: sampleQuestions,
      duration: 30, // 30 minutes
      totalPoints: sampleQuestions.reduce((sum, q) => sum + q.points, 0),
      passingScore: 60, // 60% passing score
    });

    console.log(`Auto-generated exam for course: ${title}`);
  } catch (examError) {
    console.error('Failed to auto-generate exam:', examError);
    // Don't fail course creation if exam generation fails
  }

  res.status(201).json(createdCourse);
});

// Helper function to generate sample MCQ questions
const generateSampleQuestions = (courseTitle, category, level) => {
  const difficulties = {
    'beginner': 'basic',
    'intermediate': 'moderate',
    'advanced': 'challenging'
  };

  const difficulty = difficulties[level?.toLowerCase()] || 'moderate';

  // Generate 10 sample questions
  const questions = [
    {
      questionText: `What is the primary focus of ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        `Understanding core concepts of ${category}`,
        'Learning unrelated topics',
        'Memorizing definitions only',
        'None of the above'
      ],
      correctAnswer: `Understanding core concepts of ${category}`
    },
    {
      questionText: `Which skill level is this course designed for?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'All levels'
      ],
      correctAnswer: level || 'All levels'
    },
    {
      questionText: `What is an important prerequisite for ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Basic understanding of the subject',
        'No prerequisites needed',
        'Advanced degree required',
        'Professional certification'
      ],
      correctAnswer: difficulty === 'basic' ? 'No prerequisites needed' : 'Basic understanding of the subject'
    },
    {
      questionText: `Which category does ${courseTitle} belong to?`,
      questionType: 'mcq',
      points: 10,
      options: [
        category || 'General',
        'Unrelated category',
        'Mixed topics',
        'Other'
      ],
      correctAnswer: category || 'General'
    },
    {
      questionText: `What is the best approach to learning ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Consistent practice and review',
        'Cramming before exams',
        'Passive listening only',
        'Skipping difficult topics'
      ],
      correctAnswer: 'Consistent practice and review'
    },
    {
      questionText: `How would you apply concepts from ${courseTitle} in real-world scenarios?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Through practical projects and exercises',
        'Only theoretical understanding',
        'Memorization without application',
        'Ignoring practical aspects'
      ],
      correctAnswer: 'Through practical projects and exercises'
    },
    {
      questionText: `What is a key benefit of completing ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        `Enhanced knowledge in ${category}`,
        'No tangible benefits',
        'Only certificate value',
        'Unrelated skills'
      ],
      correctAnswer: `Enhanced knowledge in ${category}`
    },
    {
      questionText: `Which learning resource is most valuable for ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Course materials and assignments',
        'Random internet articles',
        'Unverified sources',
        'Social media posts'
      ],
      correctAnswer: 'Course materials and assignments'
    },
    {
      questionText: `What should be your primary goal when studying ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Deep understanding of concepts',
        'Just passing the exam',
        'Minimal effort',
        'Copying others work'
      ],
      correctAnswer: 'Deep understanding of concepts'
    },
    {
      questionText: `How can you measure your progress in ${courseTitle}?`,
      questionType: 'mcq',
      points: 10,
      options: [
        'Regular assessments and self-evaluation',
        'Guessing your knowledge',
        'Comparing with others only',
        'Ignoring feedback'
      ],
      correctAnswer: 'Regular assessments and self-evaluation'
    }
  ];

  return questions;
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category, level, thumbnail } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this course');
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;
    course.level = level || course.level;
    course.thumbnail = thumbnail || course.thumbnail;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this course');
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
// @access  Private/Instructor/Admin
const addLesson = asyncHandler(async (req, res) => {
  const { title, content, videoUrl, duration } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to add lessons to this course');
    }

    const lesson = {
      title,
      content,
      videoUrl,
      duration,
    };

    course.lessons.push(lesson);
    await course.save();
    res.status(201).json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Get enrolled courses for student
// @route   GET /api/courses/enrolled
// @access  Private/Student
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ enrolledStudents: req.user._id })
    .populate('instructor', 'name email')
    .sort('-createdAt');

  res.json(courses);
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  getEnrolledCourses,
};
