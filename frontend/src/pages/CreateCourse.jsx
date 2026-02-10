import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaChalkboardTeacher, FaImage, FaDollarSign, FaLayerGroup, FaTag } from 'react-icons/fa';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [thumbnail, setThumbnail] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/courses', {
                title,
                description,
                price,
                category,
                level,
                thumbnail,
            });
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
                <FaChalkboardTeacher className="mr-3" /> Create New Course
            </h1>

            <div className="bg-discord-gray p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Course Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            placeholder="e.g. Advanced React Patterns"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full bg-discord-sidebar text-white p-3 rounded h-32 focus:outline-none focus:ring-2 focus:ring-discord-blue resize-none"
                            placeholder="What will students learn in this course?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                                <FaDollarSign className="inline mr-1" /> Price ($)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                                <FaLayerGroup className="inline mr-1" /> Level
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                                <FaTag className="inline mr-1" /> Category
                            </label>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                                placeholder="e.g. Web Development"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                                <FaImage className="inline mr-1" /> Thumbnail URL
                            </label>
                            <input
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-discord-blue hover:bg-discord-blue/80 text-white font-bold py-3 px-6 rounded w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
