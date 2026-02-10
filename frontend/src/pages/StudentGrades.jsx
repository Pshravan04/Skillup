import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { FaChartBar, FaCheckCircle, FaTimesCircle, FaTrophy, FaFileAlt } from 'react-icons/fa';

const StudentGrades = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, graded: 0, avgGrade: 0 });

    useEffect(() => {
        if (user?.role !== 'student') {
            navigate('/dashboard');
            return;
        }
        fetchGrades();
    }, [user]);

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/grades/student');
            const gradesArray = Array.isArray(data) ? data : [];
            setGrades(gradesArray);

            // Calculate stats
            const graded = gradesArray.filter(g => g.grade !== null && g.grade !== undefined);
            const avgGrade = graded.length > 0
                ? graded.reduce((sum, g) => sum + parseFloat(g.grade || 0), 0) / graded.length
                : 0;

            setStats({
                total: gradesArray.length,
                graded: graded.length,
                avgGrade: avgGrade.toFixed(1)
            });
        } catch (error) {
            console.error('Error fetching grades:', error);
            setGrades([]);
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade, totalPoints) => {
        const percentage = (grade / totalPoints) * 100;
        if (percentage >= 90) return 'text-green-500';
        if (percentage >= 80) return 'text-blue-500';
        if (percentage >= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <FaChartBar className="mr-3" /> My Grades & Progress
                </h1>
                <p className="text-discord-text-muted">Track your performance across all courses.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-discord-gray p-6 rounded-lg shadow-lg border-l-4 border-discord-blue">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-discord-text-muted text-sm mb-1">Total Submissions</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <FaFileAlt className="text-4xl text-discord-blue opacity-50" />
                    </div>
                </div>

                <div className="bg-discord-gray p-6 rounded-lg shadow-lg border-l-4 border-discord-green">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-discord-text-muted text-sm mb-1">Graded</p>
                            <p className="text-3xl font-bold text-white">{stats.graded}</p>
                        </div>
                        <FaCheckCircle className="text-4xl text-discord-green opacity-50" />
                    </div>
                </div>

                <div className="bg-discord-gray p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-discord-text-muted text-sm mb-1">Average Grade</p>
                            <p className="text-3xl font-bold text-white">{stats.avgGrade}%</p>
                        </div>
                        <FaTrophy className="text-4xl text-yellow-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            {loading ? (
                <div className="text-center text-discord-text-muted py-8">Loading grades...</div>
            ) : grades.length === 0 ? (
                <div className="bg-discord-gray p-8 rounded-lg shadow-lg text-center">
                    <p className="text-discord-text-muted">No submissions yet. Start taking exams and submitting assignments!</p>
                </div>
            ) : (
                <div className="bg-discord-gray rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-discord-sidebar">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Assignment/Exam</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Submitted</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Grade</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-discord-text-muted uppercase">Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-discord-light">
                                {grades.map((submission) => {
                                    const item = submission.assignment || submission.exam;
                                    const totalPoints = item?.totalPoints || 100;
                                    const hasGrade = submission.grade !== null && submission.grade !== undefined;

                                    return (
                                        <tr key={submission._id} className="hover:bg-discord-light transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">
                                                {item?.title || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${submission.assignment ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                                    }`}>
                                                    {submission.assignment ? 'Assignment' : 'Exam'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-discord-text-muted text-sm">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {hasGrade ? (
                                                    <div>
                                                        <span className={`text-lg font-bold ${getGradeColor(submission.grade, totalPoints)}`}>
                                                            {submission.grade}/{totalPoints}
                                                        </span>
                                                        <span className="text-xs text-discord-text-muted ml-2">
                                                            ({((submission.grade / totalPoints) * 100).toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-discord-text-muted text-sm">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {submission.feedback ? (
                                                    <div className="max-w-xs">
                                                        <p className="text-discord-text-muted text-sm truncate" title={submission.feedback}>
                                                            {submission.feedback}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-discord-text-muted text-sm">No feedback</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentGrades;
