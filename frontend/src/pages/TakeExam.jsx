import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaClipboardCheck, FaClock, FaArrowLeft } from 'react-icons/fa';

const TakeExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const { data } = await API.get(`/exams/${id}`);
                setExam(data);
                setTimeRemaining(data.duration * 60); // Convert minutes to seconds
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmit(new Event('submit'));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            answer: answers[qId]
        }));

        console.log('Submitting exam with data:', {
            examId: id,
            answersCount: formattedAnswers.length,
            answers: formattedAnswers
        });

        try {
            const response = await API.post(`/exams/${id}/submit`, {
                answers: formattedAnswers
            });
            console.log('Exam submitted successfully:', response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Exam submission error:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || 'Failed to submit exam';

            // Check if already submitted
            if (errorMsg.includes('already submitted')) {
                setAlreadySubmitted(true);
            }

            alert(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading exam...</div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Exam not found</div>
            </div>
        );
    }

    // Show already submitted message
    if (alreadySubmitted) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaClipboardCheck className="text-4xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Exam Already Submitted</h2>
                    <p className="text-gray-400 mb-6">
                        You have already submitted this exam. You cannot submit it again.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = exam.questions.length;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <FaClipboardCheck className="text-2xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{exam.title}</h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    {totalQuestions} Questions • {exam.duration} Minutes
                                </p>
                            </div>
                        </div>

                        {/* Timer */}
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 text-white">
                                <FaClock className="text-orange-400" />
                                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{answeredCount} / {totalQuestions} answered</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {exam.questions.map((q, index) => (
                    <div key={q._id} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <p className="text-white font-medium">{q.questionText}</p>
                                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg ml-4 flex-shrink-0">
                                        {q.points} pts
                                    </span>
                                </div>

                                {q.questionType === 'mcq' ? (
                                    <div className="space-y-2">
                                        {q.options.map((opt, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/10"
                                            >
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value={opt}
                                                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                    className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-300">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                        rows="5"
                                        className="w-full bg-white/5 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-500"
                                        placeholder="Type your answer here..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <div className="sticky bottom-4 bg-discord-dark/95 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            {answeredCount === totalQuestions ? (
                                <span className="text-green-400">✓ All questions answered</span>
                            ) : (
                                <span>{totalQuestions - answeredCount} questions remaining</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center gap-2 border border-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaClipboardCheck />
                            {submitting ? 'Submitting...' : 'Submit Exam'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TakeExam;
