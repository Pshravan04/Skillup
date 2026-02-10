import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { FaChartLine, FaCheckCircle, FaTimesCircle, FaEdit, FaSave } from 'react-icons/fa';

const Gradebook = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

    useEffect(() => {
        if (user?.role !== 'instructor') {
            navigate('/dashboard');
            return;
        }
        fetchInstructorCourses();
    }, [user]);

    const fetchInstructorCourses = async () => {
        try {
            const { data } = await API.get('/courses/instructor');
            const coursesArray = Array.isArray(data) ? data : [];
            setCourses(coursesArray);
            if (coursesArray.length > 0) {
                setSelectedCourse(coursesArray[0]._id);
                fetchGrades(coursesArray[0]._id);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]); // Ensure courses is always an array
        }
    };

    const fetchGrades = async (courseId) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/grades/course/${courseId}`);
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching grades:', error);
            setSubmissions([]); // Ensure submissions is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        fetchGrades(courseId);
    };

    const startEditing = (submission) => {
        setEditingId(submission._id);
        setGradeData({
            grade: submission.grade || '',
            feedback: submission.feedback || ''
        });
    };

    const handleGradeSubmit = async (submissionId) => {
        try {
            await API.put(`/submissions/${submissionId}/grade`, gradeData);
            setEditingId(null);
            fetchGrades(selectedCourse);
        } catch (error) {
            console.error('Error updating grade:', error);
            alert('Failed to update grade');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <FaChartLine className="mr-3" /> Gradebook
                </h1>
                <p className="text-discord-text-muted">Track and grade student submissions across your courses.</p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-discord-gray p-8 rounded-lg shadow-lg text-center">
                    <p className="text-discord-text-muted">You haven't created any courses yet.</p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Select Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            className="bg-discord-gray text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue w-full max-w-md"
                        >
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="text-center text-discord-text-muted py-8">Loading submissions...</div>
                    ) : submissions.length === 0 ? (
                        <div className="bg-discord-gray p-8 rounded-lg shadow-lg text-center">
                            <p className="text-discord-text-muted">No submissions yet for this course.</p>
                        </div>
                    ) : (
                        <div className="bg-discord-gray rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-discord-sidebar">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Student</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Assignment/Exam</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Submitted</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Grade</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Feedback</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-discord-light">
                                        {submissions.map((submission) => (
                                            <tr key={submission._id} className="hover:bg-discord-light transition-colors">
                                                <td className="px-6 py-4 text-white">
                                                    <div>
                                                        <div className="font-medium">{submission.student?.name}</div>
                                                        <div className="text-xs text-discord-text-muted">{submission.student?.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white">
                                                    {submission.assignment?.title || submission.exam?.title}
                                                    <div className="text-xs text-discord-text-muted">
                                                        Total: {submission.assignment?.totalPoints || submission.exam?.totalPoints} pts
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-discord-text-muted text-sm">
                                                    {new Date(submission.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingId === submission._id ? (
                                                        <input
                                                            type="number"
                                                            value={gradeData.grade}
                                                            onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                                                            className="bg-discord-sidebar text-white p-2 rounded w-20 focus:outline-none focus:ring-2 focus:ring-discord-blue"
                                                            placeholder="0"
                                                        />
                                                    ) : (
                                                        <span className={`font-bold ${submission.grade ? 'text-discord-green' : 'text-discord-text-muted'}`}>
                                                            {submission.grade || 'Not graded'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingId === submission._id ? (
                                                        <textarea
                                                            value={gradeData.feedback}
                                                            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                            className="bg-discord-sidebar text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-discord-blue resize-none"
                                                            rows={2}
                                                            placeholder="Add feedback..."
                                                        />
                                                    ) : (
                                                        <span className="text-discord-text-muted text-sm">
                                                            {submission.feedback || 'No feedback'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingId === submission._id ? (
                                                        <button
                                                            onClick={() => handleGradeSubmit(submission._id)}
                                                            className="bg-discord-green hover:bg-discord-green/80 text-white px-3 py-1 rounded text-sm flex items-center"
                                                        >
                                                            <FaSave className="mr-1" /> Save
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditing(submission)}
                                                            className="bg-discord-blue hover:bg-discord-blue/80 text-white px-3 py-1 rounded text-sm flex items-center"
                                                        >
                                                            <FaEdit className="mr-1" /> Grade
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Gradebook;
