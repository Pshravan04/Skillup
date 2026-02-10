import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AuthContext from '../../context/AuthContext';
import CourseCard from '../../components/CourseCard';
import CalendarWidget from '../../components/CalendarWidget';
import MentorsSection from '../../components/MentorsSection';
import LearningProgress from '../../components/LearningProgress';
import { FaBook, FaGraduationCap, FaClock, FaTrophy } from 'react-icons/fa';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch enrolled courses
                const enrolledResponse = await API.get('/courses/enrolled');
                setEnrolledCourses(enrolledResponse.data);

                // Fetch all courses for recommendations
                const allResponse = await API.get('/courses');
                setAllCourses(allResponse.data.filter(course =>
                    !enrolledResponse.data.some(enrolled => enrolled._id === course._id)
                ).slice(0, 3)); // Show top 3 recommendations
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading dashboard...</div>
            </div>
        );
    }

    const stats = [
        {
            icon: FaBook,
            label: 'Enrolled Courses',
            value: enrolledCourses.length,
            color: 'from-blue-500 to-purple-500'
        },
        {
            icon: FaGraduationCap,
            label: 'Completed',
            value: enrolledCourses.filter(c => c.progress === 100).length,
            color: 'from-green-500 to-teal-500'
        },
        {
            icon: FaClock,
            label: 'In Progress',
            value: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: FaTrophy,
            label: 'Achievements',
            value: 0,
            color: 'from-yellow-500 to-orange-500'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-400">Continue your learning journey</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="text-white text-xl" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Courses */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Continue Learning */}
                    {enrolledCourses.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
                                <Link
                                    to="/courses"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {enrolledCourses.slice(0, 4).map((course, index) => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        gradient={['blue', 'orange', 'purple', 'teal'][index % 4]}
                                        onClick={() => window.location.href = `/course/${course._id}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Recommended Courses */}
                    {allCourses.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
                                <Link
                                    to="/courses"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Explore More
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allCourses.map((course, index) => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        gradient={['red', 'teal', 'purple'][index % 3]}
                                        onClick={() => window.location.href = `/course/${course._id}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {enrolledCourses.length === 0 && (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
                            <FaBook className="text-5xl text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Enrolled Courses Yet</h3>
                            <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course</p>
                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-orange-500/20"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-6">
                    <CalendarWidget />
                    <MentorsSection />
                    <LearningProgress />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
