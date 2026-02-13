import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import AuthContext from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import { FaUser, FaClock, FaStar, FaLock, FaPlayCircle, FaCheckCircle, FaClipboardList, FaFileAlt } from 'react-icons/fa';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('lessons');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await API.get(`/courses/${id}`);
                setCourse(courseRes.data);

                if (user) {
                    const isEnrolled = courseRes.data.enrolledStudents.includes(user._id);
                    const isInstructor = courseRes.data.instructor._id === user._id;

                    if (isEnrolled || isInstructor || user.role === 'admin') {
                        const assignmentsRes = await API.get(`/assignments/course/${id}`);
                        setAssignments(assignmentsRes.data);

                        const examsRes = await API.get(`/exams/course/${id}`);
                        setExams(examsRes.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching course data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await API.post(`/student/enroll/${id}`);
            alert('Enrolled successfully!');
            navigate(0);
        } catch (error) {
            alert(error.response?.data?.message || 'Enrollment failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="text-discord-text-muted font-bold tracking-widest uppercase text-xs">Buffering Mastery...</div>
                </div>
            </div>
        );
    }

    if (!course) return <div className="text-white text-center mt-10">Module Not Found</div>;

    const isEnrolled = user && course.enrolledStudents.includes(user._id);
    const isOwner = user && course.instructor._id === user._id;
    const canAccess = isEnrolled || isOwner || (user && user.role === 'admin');

    return (
        <div className="fade-in space-y-12">
            {/* Immersive Hero Section */}
            <div className="glass-card rounded-[3rem] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-10"></div>

                <div className="h-[450px] relative overflow-hidden">
                    <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200'}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[20s]"
                    />

                    {/* Floating Hero Content */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-20 max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="glass-card px-4 py-1.5 rounded-full text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] border-brand-primary/30">
                                {course.category || 'Professional Track'}
                            </span>
                            <div className="flex text-yellow-500 text-xs">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            {course.title}
                        </h1>

                        <p className="text-discord-text-muted text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl">
                            {course.description}
                        </p>

                        <div className="flex items-center gap-8 text-white/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-premium p-0.5">
                                    <div className="w-full h-full bg-brand-dark rounded-full flex items-center justify-center font-black text-[10px]">
                                        {course.instructor.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted mb-0.5">Architect</p>
                                    <p className="text-sm font-bold text-white tracking-tight">{course.instructor.name}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted mb-0.5">Environment</p>
                                <p className="text-sm font-bold text-white tracking-tight">Self-Paced Hybrid</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl font-black text-white tracking-tight">
                            {course.price > 0 ? `$${course.price}` : 'COMPLIMENTARY'}
                        </div>
                        {course.price > 0 && <span className="text-discord-text-muted text-xs line-through">$199</span>}
                    </div>

                    <div className="flex gap-4">
                        {user && user.role === 'student' && !isEnrolled && (
                            course.price > 0 ? (
                                <button onClick={() => setShowPaymentModal(true)} className="px-10 h-16 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    <span className="uppercase text-xs tracking-widest">Enroll In Program</span>
                                </button>
                            ) : (
                                <button onClick={handleEnroll} className="px-10 h-16 bg-gradient-premium text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    <span className="uppercase text-xs tracking-widest">Start Path Now</span>
                                </button>
                            )
                        )}
                        {isEnrolled && (
                            <div className="flex items-center justify-center gap-3 px-8 h-16 glass-card rounded-2xl border-emerald-500/30 bg-emerald-500/10">
                                <FaCheckCircle className="text-emerald-500" />
                                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Active Enrollment</span>
                            </div>
                        )}
                        {(isOwner || (user && user.role === 'admin')) && (
                            <Link to={`/course/${id}/manage`} className="px-10 h-16 glass-button text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-primary transition-all">
                                <span className="uppercase text-xs tracking-widest">Manage Control Hub</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Curriculum Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* Navigation Tabs */}
                    <div className="flex gap-4 p-2 glass-card rounded-[1.5rem] bg-white/[0.02]">
                        {[
                            { id: 'lessons', label: 'Curriculum', icon: FaPlayCircle },
                            { id: 'assignments', label: 'Projects', icon: FaClipboardList },
                            { id: 'exams', label: 'Evaluations', icon: FaFileAlt }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 h-14 flex items-center justify-center gap-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-lg'
                                    : 'text-discord-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="text-sm" />
                                <span className="hidden sm:block">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Matrix Content */}
                    <div className="glass-card p-4 rounded-[2.5rem] bg-white/[0.01]">
                        {activeTab === 'lessons' && (
                            <div className="space-y-4">
                                {course.lessons.map((lesson, index) => (
                                    <div key={index} className={`group p-6 rounded-[2rem] flex items-center justify-between transition-all ${canAccess ? 'hover:bg-brand-primary/5 cursor-pointer' : 'opacity-40'}`}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-discord-text-muted group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white group-hover:text-brand-primary transition-colors tracking-tight">{lesson.title}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted">{lesson.duration} Minutes • Core Module</p>
                                            </div>
                                        </div>
                                        {canAccess ? (
                                            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-brand-primary/50 text-discord-text-muted group-hover:text-brand-primary">
                                                <FaPlayCircle />
                                            </div>
                                        ) : (
                                            <FaLock className="text-discord-text-muted/20" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div className="space-y-4">
                                {assignments.length > 0 ? assignments.map(a => (
                                    <div key={a._id} className="p-8 glass-card rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 border-white/5 hover:border-brand-primary/30 transition-all">
                                        <div className="flex items-center gap-6 text-center sm:text-left">
                                            <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl">
                                                <FaClipboardList />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white tracking-tight leading-none mb-2">{a.title}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted">
                                                    Deadline: {new Date(a.dueDate).toLocaleDateString()} • {a.totalPoints} Power Points
                                                </p>
                                            </div>
                                        </div>
                                        {user.role === 'student' && (
                                            <Link to={`/assignment/${a._id}/submit`} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10">
                                                Enter Workspace
                                            </Link>
                                        )}
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-discord-text-muted font-bold text-sm tracking-widest uppercase">No Projects Registered</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'exams' && (
                            <div className="space-y-4">
                                {exams.length > 0 ? exams.map(e => (
                                    <div key={e._id} className="p-8 glass-card rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 border-white/5 hover:border-rose-500/30 transition-all group">
                                        <div className="flex items-center gap-6 text-center sm:text-left">
                                            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 text-2xl group-hover:animate-pulse">
                                                <FaFileAlt />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white tracking-tight leading-none mb-2">{e.title}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted">
                                                    Restricted Access • {e.duration} Minute Lockdown
                                                </p>
                                            </div>
                                        </div>
                                        {user.role === 'student' && (
                                            <Link to={`/exam/${e._id}/take`} className="px-8 py-3 bg-rose-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all">
                                                Initiate Exam
                                            </Link>
                                        )}
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-discord-text-muted font-bold text-sm tracking-widest uppercase">No Evaluations Found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Utilities */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[3rem] bg-brand-primary/5 border-brand-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <h3 className="font-black text-white text-xl tracking-tight mb-8">Course Perks</h3>
                        <ul className="space-y-6">
                            {[
                                { text: 'Full Lifetime Access', icon: FaCheckCircle },
                                { text: 'Cross-Platform Sync', icon: FaCheckCircle },
                                { text: 'Professional Certification', icon: FaCheckCircle },
                                { text: 'Direct Mentor Access', icon: FaUser },
                            ].map((perk, i) => (
                                <li key={i} className="flex items-center gap-4 group/item">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/item:border-emerald-500/50 transition-colors">
                                        <perk.icon className="text-emerald-500 text-[10px]" />
                                    </div>
                                    <span className="text-discord-text-muted font-bold text-xs group-hover/item:text-white transition-colors tracking-tight">{perk.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 p-6 glass-card rounded-[2rem] bg-white/[0.02] border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-discord-text-muted mb-4 text-center">Ready to master this?</p>
                            <button className="w-full py-4 glass-button rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-all">
                                Download Syllabus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    course={course}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        alert('Payment Successful! You are enrolled.');
                        navigate(0);
                    }}
                />
            )}
        </div>
    );
};

export default CourseDetail;
