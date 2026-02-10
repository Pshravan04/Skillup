import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaPlus, FaTrash, FaSave, FaFileAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const AddExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(60);
    const [totalPoints, setTotalPoints] = useState(100);
    const [passingScore, setPassingScore] = useState(40);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Temp question state
    const [qText, setQText] = useState('');
    const [qType, setQType] = useState('mcq');
    const [qPoints, setQPoints] = useState(10);
    const [qOptions, setQOptions] = useState('');
    const [qCorrect, setQCorrect] = useState('');

    const addQuestion = () => {
        if (!qText) return alert("Question text is required");
        if (qType === 'mcq' && (!qOptions || !qCorrect)) {
            return alert("MCQ questions require options and correct answer");
        }

        const newQ = {
            questionText: qText,
            questionType: qType,
            points: Number(qPoints),
            options: qType === 'mcq' ? qOptions.split(';').map(o => o.trim()).filter(o => o) : [],
            correctAnswer: qType === 'mcq' ? qCorrect : '',
        };
        setQuestions([...questions, newQ]);
        setQText('');
        setQOptions('');
        setQCorrect('');
        setQPoints(10);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (questions.length === 0) {
            return alert("Please add at least one question");
        }

        setLoading(true);
        try {
            await API.post('/exams', {
                title,
                courseId: id,
                duration,
                totalPoints,
                passingScore,
                questions
            });
            navigate(`/course/${id}/manage`);
        } catch (error) {
            console.error(error);
            alert('Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(`/course/${id}/manage`)}
                    className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
                >
                    <FaArrowLeft /> Back to Course
                </button>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <FaFileAlt className="text-xl" />
                    </div>
                    Create Exam
                </h1>
                <p className="text-gray-400 mt-2">Add questions and configure exam settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Exam Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 sticky top-4">
                        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                            <FaFileAlt className="text-green-400" />
                            Exam Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g., Midterm Exam"
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 transition-colors placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                    min="1"
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Total Points</label>
                                <input
                                    type="number"
                                    value={totalPoints}
                                    onChange={(e) => setTotalPoints(e.target.value)}
                                    required
                                    min="1"
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Passing Score (%)</label>
                                <input
                                    type="number"
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(e.target.value)}
                                    required
                                    min="0"
                                    max="100"
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="text-sm text-gray-400 space-y-2">
                                <div className="flex justify-between">
                                    <span>Questions:</span>
                                    <span className="text-white font-semibold">{questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Points:</span>
                                    <span className="text-white font-semibold">
                                        {questions.reduce((sum, q) => sum + q.points, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || questions.length === 0}
                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave />
                            {loading ? 'Saving...' : 'Save Exam'}
                        </button>
                    </div>
                </div>

                {/* Right Column - Questions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add Question Form */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-semibold text-white mb-6">Add Question</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Question Text</label>
                                <textarea
                                    value={qText}
                                    onChange={(e) => setQText(e.target.value)}
                                    rows={3}
                                    placeholder="Enter your question here..."
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Type</label>
                                    <select
                                        value={qType}
                                        onChange={(e) => setQType(e.target.value)}
                                        className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="mcq">Multiple Choice</option>
                                        <option value="subjective">Subjective</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Points</label>
                                    <input
                                        type="number"
                                        value={qPoints}
                                        onChange={(e) => setQPoints(e.target.value)}
                                        min="1"
                                        className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {qType === 'mcq' && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Options (separate with semicolon)
                                        </label>
                                        <input
                                            value={qOptions}
                                            onChange={(e) => setQOptions(e.target.value)}
                                            placeholder="Option A; Option B; Option C; Option D"
                                            className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Correct Answer (exact match)
                                        </label>
                                        <input
                                            value={qCorrect}
                                            onChange={(e) => setQCorrect(e.target.value)}
                                            placeholder="Option A"
                                            className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={addQuestion}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-blue-500/20"
                            >
                                <FaPlus />
                                Add Question
                            </button>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-green-400" />
                            Questions ({questions.length})
                        </h3>
                        {questions.length === 0 ? (
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
                                <p className="text-gray-400 italic">No questions added yet. Add your first question above.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q, index) => (
                                    <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">{q.questionText}</p>
                                                        <div className="mt-2 flex items-center gap-3 text-xs">
                                                            <span className="bg-white/10 px-2 py-1 rounded-lg text-gray-300 uppercase">
                                                                {q.questionType}
                                                            </span>
                                                            <span className="text-gray-400">{q.points} pts</span>
                                                        </div>
                                                        {q.questionType === 'mcq' && (
                                                            <div className="mt-2 text-sm text-gray-400">
                                                                <span className="text-green-400">✓</span> {q.correctAnswer}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeQuestion(index)}
                                                className="text-gray-400 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExam;
