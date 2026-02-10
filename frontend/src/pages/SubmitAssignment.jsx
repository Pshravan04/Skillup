import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaCloudUploadAlt, FaArrowLeft, FaFileAlt } from 'react-icons/fa';

const SubmitAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const { data } = await API.get(`/assignments/${id}`);
                setAssignment(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post(`/assignments/${id}/submit`, {
                fileUrl
            });
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading assignment...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>
            </div>

            {/* Assignment Card */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FaCloudUploadAlt className="text-4xl text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Submit Assignment</h2>
                {assignment && (
                    <div className="mb-6">
                        <h3 className="text-lg text-gray-300 mb-2">{assignment.title}</h3>
                        <p className="text-sm text-gray-400">{assignment.description}</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <FaFileAlt />
                                {assignment.totalPoints} points
                            </span>
                            {assignment.dueDate && (
                                <span>
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-gray-400 mb-8">
                    Paste the link to your work (Google Drive, GitHub, Dropbox, etc.)
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            File URL
                        </label>
                        <input
                            type="url"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            required
                            placeholder="https://drive.google.com/..."
                            className="w-full bg-white/5 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Make sure the link is publicly accessible or shared with your instructor
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCloudUploadAlt />
                            {submitting ? 'Submitting...' : 'Submit Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitAssignment;
