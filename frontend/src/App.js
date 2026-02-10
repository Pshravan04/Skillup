import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import ManageCourse from './pages/ManageCourse';
import AddAssignment from './pages/AddAssignment';
import AddExam from './pages/AddExam';
import SubmitAssignment from './pages/SubmitAssignment';
import TakeExam from './pages/TakeExam';
import Gradebook from './pages/Gradebook';
import InstructorProfile from './pages/InstructorProfile';
import StudentGrades from './pages/StudentGrades';
import ProfileSettings from './pages/ProfileSettings';
import Chat from './components/Chat';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const App = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses/create" element={<CreateCourse />} />
                <Route path="/course/:id/manage" element={<ManageCourse />} />
                <Route path="/course/:id/add-assignment" element={<AddAssignment />} />
                <Route path="/course/:id/add-exam" element={<AddExam />} />
                <Route path="/assignment/:id/submit" element={<SubmitAssignment />} />
                <Route path="/exam/:id/take" element={<TakeExam />} />
                <Route path="/gradebook" element={<Gradebook />} />
                <Route path="/instructor/profile" element={<InstructorProfile />} />
                <Route path="/student/grades" element={<StudentGrades />} />
                <Route path="/settings" element={<ProfileSettings />} />
              </Route>

              <Route path="/" element={<Home />} />
            </Routes>
            <Chat />
          </Layout>
        </Router>
      </Elements>
    </AuthProvider>
  );
};

export default App;
