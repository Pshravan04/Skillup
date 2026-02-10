import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { FaPlus, FaVideo, FaClipboardList, FaFileAlt } from 'react-icons/fa';

const ManageCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lesson form state
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonContent, setLessonContent] = useState('');
    const [lessonDuration, setLessonDuration] = useState(0);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const { data } = await API.get(`/courses/${id}`);
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/courses/${id}/lessons`, {
                title: lessonTitle,
                content: lessonContent,
                duration: lessonDuration,
            });
            alert('Lesson added!');
            setLessonTitle('');
            setLessonContent('');
            setLessonDuration(0);
            fetchCourse(); // Refresh
        } catch (error) {
            alert('Failed to add lesson');
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading course details...</div>;
    if (!course) return <div className="text-white text-center mt-10">Course not found</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage: {course.title}</h1>
                    <p className="text-discord-text-muted">Add content, assignments, and manage your students.</p>
                </div>
                <Link to="/dashboard" className="text-discord-text-muted hover:text-white transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Add Lesson Form */}
                    <div className="bg-discord-gray p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <FaVideo className="mr-2 text-discord-blue" /> Add New Lesson
                        </h2>
                        <form onSubmit={handleAddLesson} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Lesson Title</label>
                                <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required
                                    className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Content / Video URL</label>
                                <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)}
                                    className="w-full bg-discord-sidebar text-white p-3 rounded h-24 focus:outline-none focus:ring-2 focus:ring-discord-blue resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Duration (mins)</label>
                                <input type="number" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} required
                                    className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                                />
                            </div>
                            <button type="submit" className="bg-discord-blue hover:bg-discord-blue/80 text-white font-bold py-2 px-4 rounded transition-colors flex items-center">
                                <FaPlus className="mr-2" /> Add Lesson
                            </button>
                        </form>
                    </div>

                    {/* Existing Lessons List */}
                    <div className="bg-discord-gray p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Course Content ({course.lessons.length})</h2>
                        <div className="space-y-2">
                            {course.lessons.length > 0 ? (
                                course.lessons.map((lesson, index) => (
                                    <div key={index} className="bg-discord-sidebar p-4 rounded flex justify-between items-center group hover:bg-discord-light transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white">{index + 1}. {lesson.title}</h4>
                                            <p className="text-xs text-discord-text-muted">{lesson.duration} mins</p>
                                        </div>
                                        <button className="text-discord-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-discord-text-muted">No lessons added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-discord-gray p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to={`/course/${id}/add-assignment`} className="block w-full text-center bg-discord-sidebar hover:bg-discord-light text-white font-medium py-3 rounded transition-colors border border-discord-light hover:border-discord-blue">
                                <FaClipboardList className="inline mr-2" /> Add Assignment
                            </Link>
                            <Link to={`/course/${id}/add-exam`} className="block w-full text-center bg-discord-sidebar hover:bg-discord-light text-white font-medium py-3 rounded transition-colors border border-discord-light hover:border-discord-green">
                                <FaFileAlt className="inline mr-2" /> Create Exam
                            </Link>
                        </div>
                    </div>

                    <div className="bg-discord-gray p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Course Status</h2>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-discord-text-muted">Enrollments</span>
                            <span className="text-white font-bold">{course.enrolledStudents?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-discord-text-muted">Status</span>
                            <span className="text-discord-green font-bold text-xs uppercase bg-discord-green/10 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;
