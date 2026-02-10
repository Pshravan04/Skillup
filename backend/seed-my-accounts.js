const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Exam = require('./src/models/Exam');
const Assignment = require('./src/models/Assignment');
const Submission = require('./src/models/Submission');
const Payment = require('./src/models/Payment');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected\n');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const addDemoData = async () => {
    try {
        // Get all users
        const users = await User.find({});
        const instructors = users.filter(u => u.role === 'instructor');
        const students = users.filter(u => u.role === 'student');

        if (instructors.length === 0) {
            console.error('❌ No instructor accounts found. Please register an instructor first.');
            process.exit(1);
        }

        if (students.length === 0) {
            console.error('❌ No student accounts found. Please register at least one student.');
            process.exit(1);
        }

        const instructor = instructors[0];
        const student1 = students[0];
        const student2 = students.length > 1 ? students[1] : null;

        console.log('✅ Found accounts:');
        console.log(`   Instructor: ${instructor.name} (${instructor.email})`);
        console.log(`   Student 1: ${student1.name} (${student1.email})`);
        if (student2) {
            console.log(`   Student 2: ${student2.name} (${student2.email})`);
        }
        console.log('\n🚀 Adding demo data...\n');

        // Create Courses for the instructor
        const enrolledStudents = student2 ? [student1._id, student2._id] : [student1._id];

        const courses = await Course.insertMany([
            {
                title: 'Complete Web Development Bootcamp 2024',
                description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 10+ real-world projects from scratch.',
                instructor: instructor._id,
                price: 99.99,
                originalPrice: 149.99,
                rating: 5.0,
                category: 'Web Development',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                gradientTheme: 'orange',
                startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                enrolledStudents: enrolledStudents
            },
            {
                title: 'Advanced JavaScript & TypeScript Masterclass',
                description: 'Deep dive into modern JavaScript ES6+, TypeScript, async programming, design patterns, and testing.',
                instructor: instructor._id,
                price: 89.99,
                originalPrice: 129.99,
                rating: 4.7,
                category: 'Programming',
                level: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
                gradientTheme: 'blue',
                startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                enrolledStudents: [student1._id]
            },
            {
                title: 'React & Redux Complete Guide',
                description: 'Build modern, scalable web applications with React, Redux, Hooks, Context API, and Next.js framework.',
                instructor: instructor._id,
                price: 109.99,
                originalPrice: 159.99,
                rating: 4.1,
                category: 'Web Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                gradientTheme: 'purple',
                startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
                enrolledStudents: student2 ? [student2._id] : []
            },
            {
                title: 'Node.js & Express Backend Development',
                description: 'Learn server-side development with Node.js, Express, MongoDB, authentication, and RESTful APIs.',
                instructor: instructor._id,
                price: 94.99,
                originalPrice: 139.99,
                rating: 4.8,
                category: 'Backend',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
                gradientTheme: 'teal',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
                enrolledStudents: enrolledStudents
            }
        ]);

        console.log(`✅ Created ${courses.length} courses`);

        // Create Exams
        const exams = await Exam.insertMany([
            {
                title: 'HTML & CSS Fundamentals Quiz',
                course: courses[0]._id,
                duration: 30,
                totalPoints: 100,
                passingScore: 70,
                questions: [
                    {
                        questionText: 'What does CSS stand for?',
                        questionType: 'mcq',
                        options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
                        correctAnswer: 'Cascading Style Sheets',
                        points: 20
                    },
                    {
                        questionText: 'Which HTML tag is used for the largest heading?',
                        questionType: 'mcq',
                        options: ['<h1>', '<h6>', '<heading>', '<head>'],
                        correctAnswer: '<h1>',
                        points: 20
                    },
                    {
                        questionText: 'Explain the CSS box model and its components.',
                        questionType: 'subjective',
                        points: 30
                    },
                    {
                        questionText: 'What is the difference between inline and block elements? Give examples.',
                        questionType: 'subjective',
                        points: 30
                    }
                ]
            },
            {
                title: 'JavaScript Basics Assessment',
                course: courses[1]._id,
                duration: 45,
                totalPoints: 100,
                passingScore: 75,
                questions: [
                    {
                        questionText: 'Which keyword is used to declare a constant in JavaScript?',
                        questionType: 'mcq',
                        options: ['var', 'let', 'const', 'constant'],
                        correctAnswer: 'const',
                        points: 15
                    },
                    {
                        questionText: 'What is a closure in JavaScript? Provide an example.',
                        questionType: 'subjective',
                        points: 35
                    },
                    {
                        questionText: 'What does the "this" keyword refer to in JavaScript?',
                        questionType: 'mcq',
                        options: ['The current object', 'The global object', 'The parent object', 'It depends on the context'],
                        correctAnswer: 'It depends on the context',
                        points: 20
                    },
                    {
                        questionText: 'Explain the difference between == and === operators in JavaScript.',
                        questionType: 'subjective',
                        points: 30
                    }
                ]
            },
            {
                title: 'React Fundamentals Test',
                course: courses[2]._id,
                duration: 40,
                totalPoints: 100,
                passingScore: 70,
                questions: [
                    {
                        questionText: 'What is JSX in React?',
                        questionType: 'mcq',
                        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
                        correctAnswer: 'JavaScript XML',
                        points: 25
                    },
                    {
                        questionText: 'Explain the difference between state and props in React.',
                        questionType: 'subjective',
                        points: 40
                    },
                    {
                        questionText: 'What are React Hooks? Name at least 3 commonly used hooks.',
                        questionType: 'subjective',
                        points: 35
                    }
                ]
            }
        ]);

        console.log(`✅ Created ${exams.length} exams`);

        // Create Assignments
        const assignments = await Assignment.insertMany([
            {
                title: 'Build a Responsive Landing Page',
                description: 'Create a fully responsive landing page for a fictional product using HTML5 and CSS3. Must include: hero section, features grid, testimonials, and contact form. Use flexbox or grid for layout.',
                course: courses[0]._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                totalPoints: 100
            },
            {
                title: 'JavaScript Calculator App',
                description: 'Build a functional calculator using vanilla JavaScript. Must support basic operations (+, -, *, /), decimal numbers, and clear function. Bonus: Add keyboard support.',
                course: courses[0]._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                totalPoints: 150
            },
            {
                title: 'Async JavaScript Weather App',
                description: 'Create a weather application that fetches data from OpenWeatherMap API using async/await. Display current weather and 5-day forecast with proper error handling.',
                course: courses[1]._id,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                totalPoints: 120
            },
            {
                title: 'TypeScript Todo Application',
                description: 'Build a todo app using TypeScript with proper types and interfaces. Features: add, edit, delete, mark complete, filter (all/active/completed). Use local storage for persistence.',
                course: courses[1]._id,
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                totalPoints: 200
            },
            {
                title: 'React Component Library',
                description: 'Create a reusable component library with at least 5 components (Button, Card, Modal, Input, Dropdown). Use props for customization and include proper PropTypes.',
                course: courses[2]._id,
                dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
                totalPoints: 180
            },
            {
                title: 'RESTful API with Node.js',
                description: 'Build a RESTful API for a blog application with CRUD operations. Include authentication, validation, and error handling. Use MongoDB for data storage.',
                course: courses[3]._id,
                dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                totalPoints: 250
            }
        ]);

        console.log(`✅ Created ${assignments.length} assignments`);

        // Create submissions for student 1
        const student1Submissions = [
            {
                student: student1._id,
                exam: exams[0]._id,
                answers: [
                    { questionId: exams[0].questions[0]._id, answer: 'Cascading Style Sheets' },
                    { questionId: exams[0].questions[1]._id, answer: '<h1>' },
                    { questionId: exams[0].questions[2]._id, answer: 'The CSS box model consists of margin, border, padding, and content. Margin is outside, content is inside.' },
                    { questionId: exams[0].questions[3]._id, answer: 'Inline elements flow with text (span, a), block elements start on new line (div, p).' }
                ],
                grade: 90,
                feedback: 'Excellent work! Great understanding of CSS fundamentals. Keep it up!',
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                student: student1._id,
                assignment: assignments[0]._id,
                fileUrl: 'https://github.com/student/landing-page-project',
                grade: 85,
                feedback: 'Good job! The layout is responsive and clean. Consider adding more animations and improving the color scheme.',
                submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                student: student1._id,
                assignment: assignments[1]._id,
                fileUrl: 'https://codepen.io/student/calculator-app',
                submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
                // Not graded yet - pending
            },
            {
                student: student1._id,
                exam: exams[1]._id,
                answers: [
                    { questionId: exams[1].questions[0]._id, answer: 'const' },
                    { questionId: exams[1].questions[1]._id, answer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned.' },
                    { questionId: exams[1].questions[2]._id, answer: 'It depends on the context' },
                    { questionId: exams[1].questions[3]._id, answer: '== checks value equality with type coercion, === checks both value and type equality without coercion.' }
                ],
                grade: 88,
                feedback: 'Very good! Your understanding of closures is solid. The === explanation was perfect.',
                submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            }
        ];

        await Submission.insertMany(student1Submissions);

        // Create submissions for student 2 if exists
        if (student2) {
            const student2Submissions = [
                {
                    student: student2._id,
                    exam: exams[0]._id,
                    answers: [
                        { questionId: exams[0].questions[0]._id, answer: 'Cascading Style Sheets' },
                        { questionId: exams[0].questions[1]._id, answer: '<h1>' },
                        { questionId: exams[0].questions[2]._id, answer: 'Box model has content, padding, border, and margin.' },
                        { questionId: exams[0].questions[3]._id, answer: 'Inline elements are like span, block elements are like div.' }
                    ],
                    grade: 75,
                    feedback: 'Good effort! Try to provide more detailed explanations for subjective questions.',
                    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    student: student2._id,
                    assignment: assignments[0]._id,
                    fileUrl: 'https://github.com/student2/landing-page',
                    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
                    // Pending grading
                },
                {
                    student: student2._id,
                    exam: exams[2]._id,
                    answers: [
                        { questionId: exams[2].questions[0]._id, answer: 'JavaScript XML' },
                        { questionId: exams[2].questions[1]._id, answer: 'State is internal to component, props are passed from parent.' },
                        { questionId: exams[2].questions[2]._id, answer: 'Hooks are functions that let you use state and lifecycle features. Examples: useState, useEffect, useContext.' }
                    ],
                    grade: 92,
                    feedback: 'Excellent! Your React knowledge is strong. Great examples of hooks.',
                    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    gradedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
                }
            ];

            await Submission.insertMany(student2Submissions);
        }

        const totalSubmissions = student2 ? student1Submissions.length + 3 : student1Submissions.length;
        console.log(`✅ Created ${totalSubmissions} submissions`);

        // Create payment records
        const payments = [
            {
                student: student1._id,
                course: courses[0]._id,
                amount: 99.99,
                transactionId: 'pi_demo_' + Date.now(),
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: student1._id,
                course: courses[1]._id,
                amount: 89.99,
                transactionId: 'pi_demo_' + (Date.now() + 1),
                paymentMethod: 'stripe',
                status: 'completed'
            }
        ];

        if (student2) {
            payments.push(
                {
                    student: student2._id,
                    course: courses[0]._id,
                    amount: 99.99,
                    transactionId: 'pi_demo_' + (Date.now() + 2),
                    paymentMethod: 'stripe',
                    status: 'completed'
                },
                {
                    student: student2._id,
                    course: courses[2]._id,
                    amount: 109.99,
                    transactionId: 'pi_demo_' + (Date.now() + 3),
                    paymentMethod: 'stripe',
                    status: 'completed'
                },
                {
                    student: student2._id,
                    course: courses[3]._id,
                    amount: 94.99,
                    transactionId: 'pi_demo_' + (Date.now() + 4),
                    paymentMethod: 'stripe',
                    status: 'completed'
                }
            );
        }

        await Payment.insertMany(payments);
        console.log(`✅ Created ${payments.length} payment records`);

        console.log('\n🎉 Demo data added successfully!\n');
        console.log('📊 Summary:');
        console.log(`- ${courses.length} Courses`);
        console.log(`- ${exams.length} Exams`);
        console.log(`- ${assignments.length} Assignments`);
        console.log(`- ${totalSubmissions} Submissions (some graded, some pending)`);
        console.log(`- ${payments.length} Payment records`);
        console.log('\n🔐 Your Accounts:');
        console.log(`\nInstructor: ${instructor.email}`);
        console.log('  - Manage 4 courses');
        console.log('  - Grade pending submissions');
        console.log('  - View student progress');
        console.log(`\nStudent 1: ${student1.email}`);
        console.log('  - Enrolled in 2 courses');
        console.log('  - 4 submissions (3 graded, 1 pending)');
        if (student2) {
            console.log(`\nStudent 2: ${student2.email}`);
            console.log('  - Enrolled in 3 courses');
            console.log('  - 3 submissions (2 graded, 1 pending)');
        }
        console.log('\n✅ Ready to test all features!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding demo data:', error);
        process.exit(1);
    }
};

connectDB().then(() => addDemoData());
