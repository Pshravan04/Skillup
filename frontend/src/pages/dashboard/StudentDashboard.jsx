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
                const enrolledResponse = await API.get('/courses/enrolled');
                setEnrolledCourses(enrolledResponse.data);

                const allResponse = await API.get('/courses');
                setAllCourses(allResponse.data.filter(course =>
                    !enrolledResponse.data.some(enrolled => enrolled._id === course._id)
                ).slice(0, 3));
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
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="text-discord-text-muted font-bold tracking-widest uppercase text-xs">Synchronizing Workspace...</div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            icon: FaBook,
            label: 'Active Library',
            value: enrolledCourses.length,
            color: 'from-brand-primary to-brand-secondary'
        },
        {
            icon: FaGraduationCap,
            label: 'Mastered',
            value: enrolledCourses.filter(c => c.progress === 100).length,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: FaClock,
            label: 'Time Invested',
            value: '42h', // Mock value for visual
            color: 'from-orange-500 to-rose-500'
        },
        {
            icon: FaTrophy,
            label: 'Milestones',
            value: 12, // Mock value for visual
            color: 'from-fuchsia-500 to-pink-500'
        },
    ];

    return (
        <div className="fade-in space-y-12">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">
                        Dashboard
                    </h1>
                    <p className="text-discord-text-muted font-medium text-lg leading-none">
                        Welcome back, <span className="text-white">{user?.name}</span>. Pulse is normal.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-discord-text-muted text-xs font-black uppercase tracking-widest mb-1">Weekly Streak</p>
                        <div className="flex gap-1 justify-end">
                            {[1, 1, 1, 1, 0, 0, 0].map((day, i) => (
                                <div key={i} className={`w-1.5 h-4 rounded-full ${day ? 'bg-brand-primary' : 'bg-white/5'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Premium Bento */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card p-8 rounded-[2.5rem] group hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <div className="w-full h-full bg-brand-dark rounded-[0.9rem] flex items-center justify-center">
                                    <stat.icon className="text-white text-lg" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-discord-text-muted whitespace-nowrap">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side (Bento Main) */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Courses Section */}
                    <div className="glass-card p-8 rounded-[3rem] bg-white/[0.01]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Active Learning</h2>
                                <p className="text-discord-text-muted text-xs font-bold uppercase tracking-widest mt-1">Pick up where you left off</p>
                            </div>
                            <Link to="/courses" className="glass-button px-6 py-2 rounded-2xl text-xs font-bold text-discord-text-muted hover:text-white uppercase tracking-widest transition-all">
                                See All
                            </Link>
                        </div>

                        {enrolledCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {enrolledCourses.slice(0, 4).map((course, index) => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        gradient={['premium', 'primary', 'secondary', 'accent'][index % 4]}
                                        onClick={() => window.location.href = `/course/${course._id}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center glass-card rounded-[2.5rem] bg-white/[0.02] border-dashed border-white/5">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <FaBook className="text-3xl text-discord-text-muted" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Active Courses</h3>
                                <p className="text-discord-text-muted text-sm max-w-xs mx-auto mb-8">
                                    Your personal growth journey hasn't started yet. Let's fix that.
                                </p>
                                <Link
                                    to="/courses"
                                    className="px-8 h-16 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform flex items-center justify-center uppercase text-xs tracking-widest"
                                >
                                    Browse Catalog
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recommendations (Bento Wide) */}
                    {allCourses.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-xl font-black text-white tracking-tight italic">Recommended For You</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {allCourses.map((course, index) => (
                                    <div key={course._id} className="glass-card group hover:border-brand-primary/30 p-4 rounded-[2rem] transition-all duration-500 overflow-hidden relative cursor-pointer" onClick={() => navigate(`/course/${course._id}`)}>
                                        <div className="h-32 w-full glass-card rounded-2xl mb-4 overflow-hidden relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${['from-indigo-500/20 to-purple-500/20', 'from-rose-500/20 to-orange-500/20', 'from-emerald-500/20 to-teal-500/20'][index % 3]}`}></div>
                                            <img
                                                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <h4 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2">{course.title}</h4>
                                        <p className="text-discord-text-muted text-[10px] uppercase font-black tracking-widest truncate">{course.instructor?.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side (Bento Sidebar) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-6 rounded-[2.5rem] bg-brand-primary/5 border-brand-primary/10">
                        <CalendarWidget />
                    </div>

                    <div className="glass-card p-2 rounded-[2.5rem]">
                        <MentorsSection />
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <LearningProgress />
                        </div>
                        {/* Decorative background glow */}
                        <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
