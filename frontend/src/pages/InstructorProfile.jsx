import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { FaUser, FaEnvelope, FaSave, FaCamera } from 'react-icons/fa';

const InstructorProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await API.put('/auth/profile', formData);
            setUser({ ...user, ...data });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'instructor') {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="container mx-auto px-4 max-w-3xl py-8">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
                <FaUser className="mr-3" /> Instructor Profile
            </h1>

            {message && (
                <div className="bg-discord-green/10 border border-discord-green text-discord-green p-3 rounded mb-6 text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-discord-red/10 border border-discord-red text-discord-red p-3 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-discord-gray p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-discord-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                            ) : (
                                formData.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-discord-blue text-white p-2 rounded-full hover:bg-discord-blue/80 transition-colors">
                            <FaCamera />
                        </button>
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
                        <p className="text-discord-text-muted">{formData.email}</p>
                        <span className="inline-block bg-discord-blue/20 text-discord-blue px-3 py-1 rounded-full text-xs font-bold mt-2">
                            Instructor
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-discord-sidebar text-white p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell students about yourself, your expertise, and teaching philosophy..."
                            className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Profile Picture URL
                        </label>
                        <input
                            type="url"
                            name="profilePicture"
                            value={formData.profilePicture}
                            onChange={handleChange}
                            placeholder="https://example.com/your-photo.jpg"
                            className="w-full bg-discord-sidebar text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-discord-green hover:bg-discord-green/80 text-white font-bold py-3 rounded transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <FaSave className="mr-2" /> Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InstructorProfile;
