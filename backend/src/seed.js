const connectDB = require('./config/db');
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Exam = require('./models/Exam');
const Assignment = require('./models/Assignment');

async function seed() {
  try {
    await connectDB({ retries: 6, delayMs: 2000 });
    console.log('Seeding database...');

    // clear existing
    await Promise.all([User.deleteMany({}), Course.deleteMany({}), Exam.deleteMany({}), Assignment.deleteMany({})]);

    // create users
    const admin = new User({ name: 'Admin User', email: 'admin@skillup.test', password: 'password', role: 'admin' });
    const instructor = new User({ name: 'Jane Instructor', email: 'jane@skillup.test', password: 'password', role: 'instructor' });
    const student = new User({ name: 'John Student', email: 'john@skillup.test', password: 'password', role: 'student' });
    await admin.save();
    await instructor.save();
    await student.save();

    // create a course
    const course = new Course({ title: 'Intro to SkillUp', description: 'Sample course', instructor: instructor._id, credits: 3, prerequisites: [] });
    course.students.push(student._id);
    await course.save();

    // create an exam
    const exam = new Exam({ course: course._id, title: 'Midterm Sample', questions: [ { text: 'What is 2+2?', type: 'mcq', options: ['2','3','4'], answer: '4' } ], scheduledAt: new Date() });
    await exam.save();

    // create an assignment
    const assignment = new Assignment({ course: course._id, title: 'Assignment 1', description: 'First assignment', dueDate: new Date(Date.now() + 7*24*3600*1000) });
    assignment.submissions = [];
    await assignment.save();

    console.log('Seed complete. Sample accounts:');
    console.log('  admin@skillup.test / password  (role: admin)');
    console.log('  jane@skillup.test / password   (role: instructor)');
    console.log('  john@skillup.test / password   (role: student)');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
