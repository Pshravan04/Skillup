import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaClipboardList, FaSave, FaArrowLeft } from 'react-icons/fa';

const AddAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [totalPoints, setTotalPoints] = useState(100);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/assignments', {
                title,
                description,
                courseId: id,
                dueDate,
                totalPoints
            });
            navigate(`/course/${id}/manage`);
        } catch (error) {
            console.error(error);
            alert('Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(`/course/${id}/manage`)}
                    className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
                >
                    <FaArrowLeft /> Back to Course
                </button>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <FaClipboardList className="text-xl" />
                    </div>
                    Create Assignment
                </h1>
                <p className="text-gray-400 mt-2">Add a new assignment for your students</p>
            </div>

            {/* Form */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Week 1 Project Submission"
                            className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={6}
                            placeholder="Provide detailed instructions for the assignment..."
                            className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-500"
                        />
                    </div>

                    {/* Due Date and Points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Total Points
                            </label>
                            <input
                                type="number"
                                value={totalPoints}
                                onChange={(e) => setTotalPoints(e.target.value)}
                                required
                                min="1"
                                className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/course/${id}/manage`)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave />
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssignment;
