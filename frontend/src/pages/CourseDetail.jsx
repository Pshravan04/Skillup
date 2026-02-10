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

    if (loading) return <div className="text-white text-center mt-10">Loading course...</div>;
    if (!course) return <div className="text-white text-center mt-10">Course not found</div>;

    const isEnrolled = user && course.enrolledStudents.includes(user._id);
    const isOwner = user && course.instructor._id === user._id;
    const canAccess = isEnrolled || isOwner || (user && user.role === 'admin');

    return (
        <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="bg-discord-gray rounded-lg overflow-hidden shadow-lg mb-8">
                <div className="h-64 bg-gray-800 relative">
                    <img
                        src={course.thumbnail || 'https://via.placeholder.com/800x300?text=Course+Banner'}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-50"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x300?text=SkillUp' }}
                    />
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-discord-gray to-transparent">
                        <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
                        <p className="text-xl text-discord-text-muted mb-4">{course.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-discord-text-muted">
                            <span className="flex items-center"><FaUser className="mr-2" /> {course.instructor.name}</span>
                            <span className="flex items-center"><FaClock className="mr-2" /> Self-paced</span>
                            <span className="flex items-center text-discord-gold"><FaStar className="mr-2" /> 4.8 (120 reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-discord-light flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                    </div>
                    <div>
                        {user && user.role === 'student' && !isEnrolled && (
                            course.price > 0 ? (
                                <button onClick={() => setShowPaymentModal(true)} className="bg-discord-green hover:bg-discord-green/80 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
                                    Enroll Now
                                </button>
                            ) : (
                                <button onClick={handleEnroll} className="bg-discord-blue hover:bg-discord-blue/80 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
                                    Start Learning
                                </button>
                            )
                        )}
                        {isEnrolled && <div className="bg-discord-green/20 text-discord-green px-4 py-2 rounded font-bold border border-discord-green">You are Enrolled</div>}
                        {(isOwner || (user && user.role === 'admin')) && (
                            <Link to={`/course/${id}/manage`} className="bg-discord-blue hover:bg-discord-blue/80 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
                                Manage Course
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex border-b border-discord-light mb-6">
                        <button
                            className={`pb-4 px-4 font-medium transition-colors border-b-2 ${activeTab === 'lessons' ? 'border-discord-blue text-white' : 'border-transparent text-discord-text-muted hover:text-white'}`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            Lessons
                        </button>
                        {canAccess && (
                            <>
                                <button
                                    className={`pb-4 px-4 font-medium transition-colors border-b-2 ${activeTab === 'assignments' ? 'border-discord-blue text-white' : 'border-transparent text-discord-text-muted hover:text-white'}`}
                                    onClick={() => setActiveTab('assignments')}
                                >
                                    Assignments
                                </button>
                                <button
                                    className={`pb-4 px-4 font-medium transition-colors border-b-2 ${activeTab === 'exams' ? 'border-discord-blue text-white' : 'border-transparent text-discord-text-muted hover:text-white'}`}
                                    onClick={() => setActiveTab('exams')}
                                >
                                    Exams
                                </button>
                            </>
                        )}
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'lessons' && (
                            <div className="space-y-3">
                                {course.lessons.map((lesson, index) => (
                                    <div key={index} className={`bg-discord-gray p-4 rounded-lg flex justify-between items-center ${!canAccess ? 'opacity-75' : ''}`}>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-discord-sidebar flex items-center justify-center mr-4 text-discord-text-muted">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{lesson.title}</h4>
                                                <p className="text-xs text-discord-text-muted">{lesson.duration} mins • Video</p>
                                            </div>
                                        </div>
                                        {canAccess ? (
                                            <FaPlayCircle className="text-discord-blue text-2xl cursor-pointer hover:text-white" />
                                        ) : (
                                            <FaLock className="text-discord-red" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'assignments' && canAccess && (
                            <div className="space-y-3">
                                {assignments.length > 0 ? assignments.map(a => (
                                    <div key={a._id} className="bg-discord-gray p-4 rounded-lg flex justify-between items-center relative overflow-hidden group">
                                        <div className="flex items-center z-10">
                                            <div className="w-10 h-10 rounded bg-discord-blue/20 flex items-center justify-center mr-4 text-discord-blue">
                                                <FaClipboardList />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{a.title}</h4>
                                                <p className="text-xs text-discord-text-muted">Due: {new Date(a.dueDate).toLocaleDateString()} • {a.totalPoints} Points</p>
                                            </div>
                                        </div>
                                        {user.role === 'student' && (
                                            <Link to={`/assignment/${a._id}/submit`} className="bg-discord-sidebar hover:bg-discord-blue text-white px-4 py-2 rounded text-sm transition-colors z-10">
                                                Submit
                                            </Link>
                                        )}
                                    </div>
                                )) : <div className="text-discord-text-muted">No assignments available.</div>}
                            </div>
                        )}

                        {activeTab === 'exams' && canAccess && (
                            <div className="space-y-3">
                                {exams.length > 0 ? exams.map(e => (
                                    <div key={e._id} className="bg-discord-gray p-4 rounded-lg flex justify-between items-center relative overflow-hidden group">
                                        <div className="flex items-center z-10">
                                            <div className="w-10 h-10 rounded bg-discord-red/20 flex items-center justify-center mr-4 text-discord-red">
                                                <FaFileAlt />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{e.title}</h4>
                                                <p className="text-xs text-discord-text-muted">Duration: {e.duration} mins</p>
                                            </div>
                                        </div>
                                        {user.role === 'student' && (
                                            <Link to={`/exam/${e._id}/take`} className="bg-discord-sidebar hover:bg-discord-red text-white px-4 py-2 rounded text-sm transition-colors z-10">
                                                Take Exam
                                            </Link>
                                        )}
                                    </div>
                                )) : <div className="text-discord-text-muted">No exams available.</div>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-discord-gray p-6 rounded-lg shadow-lg">
                        <h3 className="font-bold text-white mb-4">Course Features</h3>
                        <ul className="space-y-3 text-sm text-discord-text-muted">
                            <li className="flex items-center"><FaCheckCircle className="text-discord-green mr-2" /> Full lifetime access</li>
                            <li className="flex items-center"><FaCheckCircle className="text-discord-green mr-2" /> Access on mobile and desktop</li>
                            <li className="flex items-center"><FaCheckCircle className="text-discord-green mr-2" /> Certificate of completion</li>
                        </ul>
                    </div>
                </div>
            </div>

            {
                showPaymentModal && (
                    <PaymentModal
                        course={course}
                        onClose={() => setShowPaymentModal(false)}
                        onSuccess={() => {
                            alert('Payment Successful! You are enrolled.');
                            navigate(0);
                        }}
                    />
                )
            }
        </div>
    );
};

export default CourseDetail;
