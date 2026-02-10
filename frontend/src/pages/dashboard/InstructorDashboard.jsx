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
                // Fetch all courses and filter by instructor (temporary solution until dedicated endpoint)
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

    if (loading) return <div className="text-discord-text-muted">Loading dashboard...</div>;

    const totalStudents = courses.reduce((acc, curr) => acc + (curr.enrolledStudents?.length || 0), 0);

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
                    <p className="text-discord-text-muted">Manage your courses and track student progress.</p>
                </div>
                <Link to="/courses/create" className="bg-discord-green hover:bg-discord-green/80 text-white px-6 py-2 rounded-lg font-bold flex items-center transition-colors">
                    <FaPlus className="mr-2" /> Create Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-discord-gray p-6 rounded-lg shadow border-l-4 border-discord-blue">
                    <h3 className="text-discord-text-muted uppercase text-xs font-bold mb-2">Total Courses</h3>
                    <p className="text-3xl font-bold text-white">{courses.length}</p>
                </div>
                <div className="bg-discord-gray p-6 rounded-lg shadow border-l-4 border-discord-green">
                    <h3 className="text-discord-text-muted uppercase text-xs font-bold mb-2">Total Students</h3>
                    <p className="text-3xl font-bold text-white">{totalStudents}</p>
                </div>
                <div className="bg-discord-gray p-6 rounded-lg shadow border-l-4 border-discord-gold">
                    <h3 className="text-discord-text-muted uppercase text-xs font-bold mb-2">Pending Assignments</h3>
                    <p className="text-3xl font-bold text-white">0</p>
                    <Link to="/gradebook" className="text-xs text-discord-blue hover:underline mt-2 block">View Gradebook</Link>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">My Courses</h2>
            {courses.length > 0 ? (
                <div className="bg-discord-gray rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-discord-dark text-discord-text-muted text-xs uppercase">
                            <tr>
                                <th className="p-4">Course Title</th>
                                <th className="p-4">Students</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-discord-text divide-y divide-discord-light">
                            {courses.map(course => (
                                <tr key={course._id} className="hover:bg-discord-light/50 transition-colors">
                                    <td className="p-4 font-medium">{course.title}</td>
                                    <td className="p-4">{course.enrolledStudents?.length || 0}</td>
                                    <td className="p-4"><span className="text-discord-green text-xs font-bold border border-discord-green px-2 py-1 rounded">PUBLISHED</span></td>
                                    <td className="p-4">
                                        <Link to={`/course/${course._id}/manage`} className="text-discord-blue hover:underline mr-4">Manage</Link>
                                        <Link to={`/course/${course._id}`} className="text-discord-text-muted hover:text-white">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-discord-gray rounded-lg border border-dashed border-discord-text-muted">
                    <p className="text-discord-text-muted mb-4">You haven't created any courses yet.</p>
                    <Link to="/courses/create" className="text-discord-blue hover:underline font-medium">Create your first course</Link>
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
