import React, { useState, useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import API from '../services/api';

const LearningProgress = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const { data: courses } = await API.get('/courses/enrolled');

            // Calculate progress for each course
            const progressData = await Promise.all(
                courses.slice(0, 2).map(async (course) => {
                    try {
                        // Fetch assignments and exams for this course
                        const [assignmentsRes, examsRes] = await Promise.all([
                            API.get(`/assignments/course/${course._id}`),
                            API.get(`/exams/course/${course._id}`)
                        ]);

                        const totalItems = assignmentsRes.data.length + examsRes.data.length;

                        // Fetch submissions to calculate completion
                        const { data: submissions } = await API.get('/submissions/my-submissions');
                        const courseSubmissions = submissions.filter(
                            s => (s.assignment?.course === course._id) || (s.exam?.course === course._id)
                        );

                        const completionPercentage = totalItems > 0
                            ? Math.round((courseSubmissions.length / totalItems) * 100)
                            : 0;

                        return {
                            id: course._id,
                            title: course.title,
                            percentage: completionPercentage,
                            color: getProgressColor(course.category)
                        };
                    } catch (error) {
                        return {
                            id: course._id,
                            title: course.title,
                            percentage: 0,
                            color: 'teal'
                        };
                    }
                })
            );

            setProgress(progressData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching progress:', error);
            setLoading(false);
        }
    };

    const getProgressColor = (category) => {
        const colorMap = {
            'Web Development': 'teal',
            'Programming': 'purple',
            'Backend': 'blue',
            'Design': 'orange'
        };
        return colorMap[category] || 'teal';
    };

    if (loading) {
        return (
            <div className="bg-discord-gray rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Learning Process</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="shimmer h-16 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-discord-gray rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Learning Process</h3>
                <button className="text-discord-blue hover:text-discord-blue/80 text-sm font-semibold flex items-center gap-1 transition-colors">
                    See all
                    <FaChevronRight className="text-xs" />
                </button>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
                {progress.length === 0 ? (
                    <p className="text-discord-text-muted text-sm text-center py-4">
                        No active courses. Enroll in courses to track your progress.
                    </p>
                ) : (
                    progress.map((item) => (
                        <div key={item.id} className="space-y-2">
                            {/* Course Title and Percentage */}
                            <div className="flex items-center justify-between">
                                <h4 className="text-white font-semibold text-sm truncate flex-1">
                                    {item.title}
                                </h4>
                                <span className="text-white font-bold text-sm ml-2">
                                    {item.percentage}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-bar bg-discord-sidebar">
                                <div
                                    className={`progress-fill progress-${item.color}`}
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>

                            {/* Striped Pattern Overlay */}
                            <div className="relative h-2 -mt-2 overflow-hidden rounded-full">
                                <div
                                    className="absolute top-0 right-0 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    style={{
                                        width: `${100 - item.percentage}%`,
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LearningProgress;
