import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import StudentDashboard from './dashboard/StudentDashboard';
import InstructorDashboard from './dashboard/InstructorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-white">Loading...</div>;

    if (user.role === 'instructor') {
        return <InstructorDashboard />;
    } else if (user.role === 'admin') {
        return <AdminDashboard />;
    } else {
        return <StudentDashboard />;
    }
};

export default Dashboard;
