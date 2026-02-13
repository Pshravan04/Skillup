import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { FaPlus, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const InstructorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await API.get('/courses');
                const myCourses = data.filter(c => c.instructor._id === user._id);
                setCourses(myCourses);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user._id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="text-discord-text-muted font-bold tracking-widest uppercase text-xs">Accessing Studio...</div>
                </div>
            </div>
        );
    }

    const totalStudents = courses.reduce((acc, curr) => acc + (curr.enrolledStudents?.length || 0), 0);

    return (
        <div className="fade-in space-y-12">
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">Instructor Studio</h1>
                    <p className="text-discord-text-muted font-medium text-lg">Manage your academy and engage with students.</p>
                </div>
                <Link to="/create-course" className="px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 group">
                    <FaPlus className="group-hover:rotate-90 transition-transform" />
                    <span className="uppercase text-xs tracking-widest">Create New Course</span>
                </Link>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
                    <h3 className="text-discord-text-muted uppercase text-[10px] font-black tracking-[0.3em] mb-4">Active Academy</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">{courses.length}</span>
                        <span className="text-discord-text-muted font-bold tracking-tight italic">Courses</span>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group border-emerald-500/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    <h3 className="text-discord-text-muted uppercase text-[10px] font-black tracking-[0.3em] mb-4">Global Reach</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">{totalStudents}</span>
                        <span className="text-discord-text-muted font-bold tracking-tight italic">Students</span>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                    <h3 className="text-discord-text-muted uppercase text-[10px] font-black tracking-[0.3em] mb-4">Evaluations</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">--</span>
                        <Link to="/gradebook" className="text-brand-primary font-bold text-xs hover:underline decoration-2 underline-offset-4 ml-4">Resolve Now</Link>
                    </div>
                </div>
            </div>

            {/* Content Table Section */}
            <div className="glass-card rounded-[3rem] overflow-hidden bg-white/[0.01]">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white tracking-tight">Management Suite</h2>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/5"></div>)}
                    </div>
                </div>

                {courses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-discord-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="p-8">Course Program</th>
                                    <th className="p-8">Enrolled</th>
                                    <th className="p-8">Status</th>
                                    <th className="p-8 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="text-discord-text divide-y divide-white/5">
                                {courses.map(course => (
                                    <tr key={course._id} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black group-hover:bg-brand-primary/10 transition-colors">
                                                    {course.title.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white group-hover:text-brand-primary transition-colors tracking-tight">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(avatar => (
                                                    <div key={avatar} className="w-8 h-8 rounded-full border-2 border-brand-dark bg-discord-gray flex items-center justify-center text-[10px] font-black uppercase">
                                                        U
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-brand-dark bg-white/5 flex items-center justify-center text-[8px] font-bold">
                                                    +{course.enrolledStudents?.length || 0}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">LIVE</span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/course/${course._id}/manage`} className="glass-button px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-white">Manage</Link>
                                                <Link to={`/course/${course._id}`} className="p-2 hover:bg-white/5 rounded-xl text-discord-text-muted hover:text-white transition-colors">
                                                    <FaChalkboardTeacher />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-32 px-10">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <FaPlus className="text-2xl text-discord-text-muted" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight italic">Academy Is Empty</h3>
                        <p className="text-discord-text-muted max-w-sm mx-auto mb-10 font-bold leading-relaxed">
                            Bring your knowledge to life by launching your first course and reaching thousands of students worldwide.
                        </p>
                        <Link to="/courses/create" className="px-10 h-16 bg-brand-primary text-white font-black rounded-2xl hover:scale-105 transition-transform flex items-center justify-center uppercase text-xs tracking-[0.2em] shadow-lg shadow-brand-primary/20">
                            Create First Program
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboard;
