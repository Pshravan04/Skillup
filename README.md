# 🎓 SkillUp - Modern Learning Management System

A full-stack Learning Management System (LMS) built with the MERN stack, featuring real-time chat, automated exam generation, and a sleek modern UI.

![SkillUp Platform](https://img.shields.io/badge/Platform-Web-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-v18+-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Access Control** - Separate dashboards for Students and Instructors
- **Course Management** - Create, edit, and manage courses with rich content
- **Assignment System** - Create and submit assignments with file uploads
- **Exam Module** - MCQ and subjective exams with auto-grading
- **Grading System** - Comprehensive gradebook for instructors
- **Payment Integration** - Stripe payment gateway for course enrollment

### 💬 Real-Time Features
- **Live Chat System** - Socket.io powered messaging between students and instructors
- **Typing Indicators** - See when someone is typing
- **Message Persistence** - All conversations saved to database
- **Unread Badges** - Track unread messages

### 🤖 AI-Powered Features
- **Auto-Exam Generation** - Automatically creates 10-question MCQ exams when courses are created
- **Smart Question Generation** - Questions adapt to course category and difficulty level

### 🎨 Modern UI/UX
- **Dark Theme** - Sleek Discord-inspired dark interface
- **Glassmorphism Effects** - Modern backdrop blur and transparency
- **Gradient Accents** - Beautiful blue-purple gradients throughout
- **Responsive Design** - Works seamlessly on all devices
- **Animated Loaders** - Multiple loader variants for better UX
- **Interactive Components** - Smooth transitions and hover effects

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Stripe React** - Payment processing
- **React Icons** - Icon library
- **Parcel** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time engine
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Nodemailer** - Email service

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Clone Repository
```bash
git clone https://github.com/yourusername/skillup-lms.git
cd skillup-lms
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

**Environment Variables (.env):**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:1234
PORT=5000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file (optional)
REACT_APP_STRIPE_KEY=your_stripe_publishable_key
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Run Application

**Development Mode:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Access the application:**
- Frontend: http://localhost:1234
- Backend API: http://localhost:5000

## 🗄️ Database Seeding

Populate the database with demo data:

```bash
cd backend

# Seed all data (users, courses, assignments, exams)
node seed.js

# Seed chat conversations
node seed-chat.js

# Seed specific user accounts
node seed-my-accounts.js
```

**Demo Accounts:**
- **Instructor:** instructor@test.com / password123
- **Student:** student@test.com / password123

## 📱 Usage

### For Students
1. **Register/Login** - Create an account or sign in
2. **Browse Courses** - Explore available courses
3. **Enroll** - Purchase courses via Stripe
4. **Learn** - Access course materials and lessons
5. **Submit Work** - Complete assignments and exams
6. **Chat** - Message instructors for help
7. **Track Progress** - View grades and progress

### For Instructors
1. **Create Courses** - Build course content
2. **Add Materials** - Upload lessons and resources
3. **Create Assessments** - Add assignments and exams (auto-generated!)
4. **Grade Students** - Review and grade submissions
5. **Manage Courses** - Edit and update course content
6. **Support Students** - Respond to chat messages

## 🎯 Key Features Explained

### Auto-Exam Generation
When an instructor creates a course, the system automatically generates a comprehensive 10-question MCQ exam:
- Questions adapt to course topic, category, and difficulty
- 30-minute duration
- 100 total points
- 60% passing score

### Real-Time Chat
- Floating chat button on all pages
- Conversation threads
- Typing indicators
- Message persistence
- Unread message badges

### Modern Authentication
- Glassmorphism login/register pages
- Animated loaders during submission
- Role selection with visual cards
- Password reset functionality

## 📂 Project Structure

```
skillup-lms/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.js        # Server entry point
│   ├── seed.js             # Database seeder
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API & Socket services
│   │   └── App.js          # App entry point
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- XSS protection
- CORS configuration

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy using Git or platform CLI
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Database (MongoDB Atlas)
- Create cluster
- Whitelist IP addresses
- Update MONGO_URI in .env

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by modern LMS platforms
- Built with love using the MERN stack
- Icons by React Icons
- UI inspiration from Discord and modern web apps

## 📧 Contact

For questions or support, reach out at: your.email@example.com

---

**⭐ Star this repo if you find it helpful!**
