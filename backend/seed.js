const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Exam.deleteMany({});
        await Assignment.deleteMany({});
        await Submission.deleteMany({});
        await Payment.deleteMany({});

        console.log('Cleared existing data');

        // Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const instructors = await User.insertMany([
            {
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@skillup.com',
                password: hashedPassword,
                role: 'instructor',
                bio: 'PhD in Computer Science with 10+ years of teaching experience. Passionate about web development and AI.',
                profilePicture: 'https://i.pravatar.cc/150?img=1'
            },
            {
                name: 'Prof. Michael Chen',
                email: 'michael.chen@skillup.com',
                password: hashedPassword,
                role: 'instructor',
                bio: 'Expert in Data Science and Machine Learning. Former Google engineer with a passion for education.',
                profilePicture: 'https://i.pravatar.cc/150?img=12'
            },
            {
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@skillup.com',
                password: hashedPassword,
                role: 'instructor',
                bio: 'Full-stack developer and UI/UX enthusiast. Love teaching modern web technologies.',
                profilePicture: 'https://i.pravatar.cc/150?img=5'
            }
        ]);

        const students = await User.insertMany([
            {
                name: 'Alex Thompson',
                email: 'alex.thompson@student.com',
                password: hashedPassword,
                role: 'student',
                profilePicture: 'https://i.pravatar.cc/150?img=8'
            },
            {
                name: 'Jessica Martinez',
                email: 'jessica.martinez@student.com',
                password: hashedPassword,
                role: 'student',
                profilePicture: 'https://i.pravatar.cc/150?img=9'
            },
            {
                name: 'David Kim',
                email: 'david.kim@student.com',
                password: hashedPassword,
                role: 'student',
                profilePicture: 'https://i.pravatar.cc/150?img=13'
            },
            {
                name: 'Sophia Williams',
                email: 'sophia.williams@student.com',
                password: hashedPassword,
                role: 'student',
                profilePicture: 'https://i.pravatar.cc/150?img=10'
            },
            {
                name: 'James Brown',
                email: 'james.brown@student.com',
                password: hashedPassword,
                role: 'student',
                profilePicture: 'https://i.pravatar.cc/150?img=14'
            }
        ]);

        console.log('Created users');

        // Create Courses
        const courses = await Course.insertMany([
            {
                title: 'Full-Stack Web Development Bootcamp',
                description: 'Master modern web development with React, Node.js, and MongoDB. Build real-world projects and deploy to production.',
                instructor: instructors[0]._id,
                price: 99.99,
                category: 'Web Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                enrolledStudents: [students[0]._id, students[1]._id, students[2]._id]
            },
            {
                title: 'Data Science with Python',
                description: 'Learn data analysis, visualization, and machine learning using Python, Pandas, and Scikit-learn.',
                instructor: instructors[1]._id,
                price: 129.99,
                category: 'Data Science',
                level: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                enrolledStudents: [students[1]._id, students[3]._id]
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Create beautiful and user-friendly interfaces. Learn design principles, Figma, and prototyping.',
                instructor: instructors[2]._id,
                price: 79.99,
                category: 'Design',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                enrolledStudents: [students[0]._id, students[2]._id, students[4]._id]
            },
            {
                title: 'JavaScript Mastery: From Basics to Advanced',
                description: 'Deep dive into JavaScript ES6+, async programming, and modern frameworks.',
                instructor: instructors[0]._id,
                price: 89.99,
                category: 'Programming',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
                enrolledStudents: [students[3]._id, students[4]._id]
            },
            {
                title: 'Machine Learning A-Z',
                description: 'Comprehensive guide to ML algorithms, neural networks, and deep learning with TensorFlow.',
                instructor: instructors[1]._id,
                price: 149.99,
                category: 'Machine Learning',
                level: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
                enrolledStudents: [students[0]._id]
            },
            {
                title: 'Mobile App Development with React Native',
                description: 'Build cross-platform mobile apps for iOS and Android using React Native.',
                instructor: instructors[2]._id,
                price: 109.99,
                category: 'Mobile Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
                enrolledStudents: []
            }
        ]);

        console.log('Created courses');

        // Create Exams
        const exams = await Exam.insertMany([
            {
                title: 'Web Development Fundamentals Quiz',
                course: courses[0]._id,
                duration: 45,
                totalPoints: 100,
                passingScore: 70,
                questions: [
                    {
                        questionText: 'What does HTML stand for?',
                        questionType: 'mcq',
                        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
                        correctAnswer: 'Hyper Text Markup Language',
                        points: 10
                    },
                    {
                        questionText: 'Which CSS property is used to change text color?',
                        questionType: 'mcq',
                        options: ['text-color', 'font-color', 'color', 'text-style'],
                        correctAnswer: 'color',
                        points: 10
                    },
                    {
                        questionText: 'Explain the difference between var, let, and const in JavaScript.',
                        questionType: 'subjective',
                        points: 20
                    },
                    {
                        questionText: 'What is the purpose of the virtual DOM in React?',
                        questionType: 'mcq',
                        options: ['To make the DOM faster', 'To create a copy of the real DOM for efficient updates', 'To replace the real DOM', 'To store component state'],
                        correctAnswer: 'To create a copy of the real DOM for efficient updates',
                        points: 15
                    },
                    {
                        questionText: 'Describe the MVC architecture pattern and its benefits.',
                        questionType: 'subjective',
                        points: 25
                    },
                    {
                        questionText: 'Which HTTP method is used to update a resource?',
                        questionType: 'mcq',
                        options: ['GET', 'POST', 'PUT', 'DELETE'],
                        correctAnswer: 'PUT',
                        points: 10
                    },
                    {
                        questionText: 'What is REST API?',
                        questionType: 'mcq',
                        options: ['A database', 'An architectural style for web services', 'A programming language', 'A framework'],
                        correctAnswer: 'An architectural style for web services',
                        points: 10
                    }
                ]
            },
            {
                title: 'Python Data Structures Assessment',
                course: courses[1]._id,
                duration: 60,
                totalPoints: 100,
                passingScore: 75,
                questions: [
                    {
                        questionText: 'Which data structure uses LIFO principle?',
                        questionType: 'mcq',
                        options: ['Queue', 'Stack', 'Array', 'Tree'],
                        correctAnswer: 'Stack',
                        points: 10
                    },
                    {
                        questionText: 'Explain the time complexity of binary search.',
                        questionType: 'subjective',
                        points: 20
                    },
                    {
                        questionText: 'What is the difference between a list and a tuple in Python?',
                        questionType: 'subjective',
                        points: 20
                    },
                    {
                        questionText: 'Which pandas function is used to read CSV files?',
                        questionType: 'mcq',
                        options: ['read_csv()', 'load_csv()', 'import_csv()', 'get_csv()'],
                        correctAnswer: 'read_csv()',
                        points: 10
                    },
                    {
                        questionText: 'Describe how a hash table works.',
                        questionType: 'subjective',
                        points: 30
                    },
                    {
                        questionText: 'What is NumPy used for?',
                        questionType: 'mcq',
                        options: ['Web development', 'Numerical computing', 'Database management', 'Mobile apps'],
                        correctAnswer: 'Numerical computing',
                        points: 10
                    }
                ]
            },
            {
                title: 'Design Principles Final Exam',
                course: courses[2]._id,
                duration: 30,
                totalPoints: 80,
                passingScore: 60,
                questions: [
                    {
                        questionText: 'What does UX stand for?',
                        questionType: 'mcq',
                        options: ['User Experience', 'User Extension', 'Universal Experience', 'Unique Experience'],
                        correctAnswer: 'User Experience',
                        points: 10
                    },
                    {
                        questionText: 'Explain the importance of white space in design.',
                        questionType: 'subjective',
                        points: 20
                    },
                    {
                        questionText: 'What is the 60-30-10 rule in color theory?',
                        questionType: 'subjective',
                        points: 25
                    },
                    {
                        questionText: 'Which tool is commonly used for prototyping?',
                        questionType: 'mcq',
                        options: ['Photoshop', 'Figma', 'Excel', 'PowerPoint'],
                        correctAnswer: 'Figma',
                        points: 10
                    },
                    {
                        questionText: 'What is responsive design?',
                        questionType: 'mcq',
                        options: ['Design that responds to user clicks', 'Design that adapts to different screen sizes', 'Design with animations', 'Design with feedback'],
                        correctAnswer: 'Design that adapts to different screen sizes',
                        points: 15
                    }
                ]
            }
        ]);

        console.log('Created exams');

        // Create Assignments
        const assignments = await Assignment.insertMany([
            {
                title: 'Build a Personal Portfolio Website',
                description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Include an about section, projects gallery, and contact form.',
                course: courses[0]._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                totalPoints: 100
            },
            {
                title: 'React Todo App with Local Storage',
                description: 'Build a todo application using React hooks. Implement add, delete, and mark as complete features. Save data to local storage.',
                course: courses[0]._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                totalPoints: 150
            },
            {
                title: 'Data Analysis Project: Sales Dataset',
                description: 'Analyze the provided sales dataset using Pandas. Create visualizations and provide insights on trends and patterns.',
                course: courses[1]._id,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                totalPoints: 120
            },
            {
                title: 'Machine Learning Model: House Price Prediction',
                description: 'Build a regression model to predict house prices. Use scikit-learn and document your approach.',
                course: courses[1]._id,
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                totalPoints: 200
            },
            {
                title: 'Mobile App Wireframes',
                description: 'Create wireframes for a mobile e-commerce app using Figma. Include at least 5 screens with proper navigation flow.',
                course: courses[2]._id,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                totalPoints: 100
            },
            {
                title: 'User Research Report',
                description: 'Conduct user interviews for a fitness app. Compile findings and create user personas.',
                course: courses[2]._id,
                dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                totalPoints: 80
            }
        ]);

        console.log('Created assignments');

        // Create Submissions (some graded, some pending)
        const submissions = await Submission.insertMany([
            // Student 0 submissions
            {
                student: students[0]._id,
                exam: exams[0]._id,
                answers: [
                    { questionId: exams[0].questions[0]._id, answer: 'Hyper Text Markup Language' },
                    { questionId: exams[0].questions[1]._id, answer: 'color' },
                    { questionId: exams[0].questions[2]._id, answer: 'var has function scope, let and const have block scope. const cannot be reassigned.' },
                    { questionId: exams[0].questions[3]._id, answer: 'To create a copy of the real DOM for efficient updates' },
                    { questionId: exams[0].questions[4]._id, answer: 'MVC separates application into Model, View, and Controller for better organization and maintainability.' },
                    { questionId: exams[0].questions[5]._id, answer: 'PUT' },
                    { questionId: exams[0].questions[6]._id, answer: 'An architectural style for web services' }
                ],
                grade: 85,
                feedback: 'Great work! Your understanding of web fundamentals is solid. Keep practicing MVC concepts.',
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                student: students[0]._id,
                assignment: assignments[0]._id,
                fileUrl: 'https://github.com/alexthompson/portfolio-project',
                grade: 92,
                feedback: 'Excellent portfolio! Clean design and responsive layout. Consider adding more animations.',
                submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            // Student 1 submissions
            {
                student: students[1]._id,
                exam: exams[0]._id,
                answers: [
                    { questionId: exams[0].questions[0]._id, answer: 'Hyper Text Markup Language' },
                    { questionId: exams[0].questions[1]._id, answer: 'font-color' },
                    { questionId: exams[0].questions[2]._id, answer: 'They are all used to declare variables in JavaScript.' },
                    { questionId: exams[0].questions[3]._id, answer: 'To make the DOM faster' },
                    { questionId: exams[0].questions[4]._id, answer: 'MVC is a design pattern used in software development.' },
                    { questionId: exams[0].questions[5]._id, answer: 'POST' },
                    { questionId: exams[0].questions[6]._id, answer: 'An architectural style for web services' }
                ],
                grade: 68,
                feedback: 'Good effort, but review CSS properties and JavaScript scoping rules. Practice more with React concepts.',
                submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                student: students[1]._id,
                assignment: assignments[1]._id,
                fileUrl: 'https://github.com/jessicamartinez/react-todo',
                submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                // Not graded yet
            },
            {
                student: students[1]._id,
                exam: exams[1]._id,
                answers: [
                    { questionId: exams[1].questions[0]._id, answer: 'Stack' },
                    { questionId: exams[1].questions[1]._id, answer: 'Binary search has O(log n) time complexity because it divides the search space in half each iteration.' },
                    { questionId: exams[1].questions[2]._id, answer: 'Lists are mutable and tuples are immutable in Python.' },
                    { questionId: exams[1].questions[3]._id, answer: 'read_csv()' },
                    { questionId: exams[1].questions[4]._id, answer: 'A hash table uses a hash function to map keys to array indices for fast lookup.' },
                    { questionId: exams[1].questions[5]._id, answer: 'Numerical computing' }
                ],
                grade: 88,
                feedback: 'Excellent understanding of data structures! Your explanations are clear and accurate.',
                submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            // Student 2 submissions
            {
                student: students[2]._id,
                assignment: assignments[0]._id,
                fileUrl: 'https://davidkim-portfolio.netlify.app',
                grade: 78,
                feedback: 'Good start! Work on improving the color scheme and add more interactive elements.',
                submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            },
            {
                student: students[2]._id,
                exam: exams[2]._id,
                answers: [
                    { questionId: exams[2].questions[0]._id, answer: 'User Experience' },
                    { questionId: exams[2].questions[1]._id, answer: 'White space improves readability and creates visual hierarchy.' },
                    { questionId: exams[2].questions[2]._id, answer: 'Use 60% dominant color, 30% secondary color, and 10% accent color.' },
                    { questionId: exams[2].questions[3]._id, answer: 'Figma' },
                    { questionId: exams[2].questions[4]._id, answer: 'Design that adapts to different screen sizes' }
                ],
                grade: 75,
                feedback: 'Good understanding of design principles. Expand on your white space explanation.',
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            // Student 3 submissions (pending grading)
            {
                student: students[3]._id,
                exam: exams[1]._id,
                answers: [
                    { questionId: exams[1].questions[0]._id, answer: 'Stack' },
                    { questionId: exams[1].questions[1]._id, answer: 'O(log n) complexity' },
                    { questionId: exams[1].questions[2]._id, answer: 'Lists can be modified, tuples cannot.' },
                    { questionId: exams[1].questions[3]._id, answer: 'read_csv()' },
                    { questionId: exams[1].questions[4]._id, answer: 'Hash tables store key-value pairs.' },
                    { questionId: exams[1].questions[5]._id, answer: 'Numerical computing' }
                ],
                grade: 60,
                submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                // Graded automatically (MCQs only)
            },
            {
                student: students[4]._id,
                assignment: assignments[4]._id,
                fileUrl: 'https://www.figma.com/file/abc123/ecommerce-wireframes',
                submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
                // Not graded yet
            }
        ]);

        console.log('Created submissions');

        // Create Payments
        await Payment.insertMany([
            {
                student: students[0]._id,
                course: courses[0]._id,
                amount: 99.99,
                transactionId: 'pi_1234567890abcdef',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[0]._id,
                course: courses[2]._id,
                amount: 79.99,
                transactionId: 'pi_abcdef1234567890',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[0]._id,
                course: courses[4]._id,
                amount: 149.99,
                transactionId: 'pi_xyz9876543210abc',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[1]._id,
                course: courses[0]._id,
                amount: 99.99,
                transactionId: 'pi_qwerty123456',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[1]._id,
                course: courses[1]._id,
                amount: 129.99,
                transactionId: 'pi_asdfgh789012',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[2]._id,
                course: courses[0]._id,
                amount: 99.99,
                transactionId: 'pi_zxcvbn345678',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[2]._id,
                course: courses[2]._id,
                amount: 79.99,
                transactionId: 'pi_mnbvcx901234',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[3]._id,
                course: courses[1]._id,
                amount: 129.99,
                transactionId: 'pi_lkjhgf567890',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[3]._id,
                course: courses[3]._id,
                amount: 89.99,
                transactionId: 'pi_poiuyt123456',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[4]._id,
                course: courses[2]._id,
                amount: 79.99,
                transactionId: 'pi_rewqsa789012',
                paymentMethod: 'stripe',
                status: 'completed'
            },
            {
                student: students[4]._id,
                course: courses[3]._id,
                amount: 89.99,
                transactionId: 'pi_trewqz345678',
                paymentMethod: 'stripe',
                status: 'completed'
            }
        ]);

        console.log('Created payments');

        console.log('\n✅ Demo data seeded successfully!');
        console.log('\n📚 Summary:');
        console.log(`- ${instructors.length} Instructors`);
        console.log(`- ${students.length} Students`);
        console.log(`- ${courses.length} Courses`);
        console.log(`- ${exams.length} Exams`);
        console.log(`- ${assignments.length} Assignments`);
        console.log(`- ${submissions.length} Submissions`);
        console.log('\n🔐 Login Credentials:');
        console.log('Password for all users: password123');
        console.log('\nInstructors:');
        instructors.forEach(i => console.log(`  - ${i.email}`));
        console.log('\nStudents:');
        students.forEach(s => console.log(`  - ${s.email}`));

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

connectDB().then(() => seedData());
