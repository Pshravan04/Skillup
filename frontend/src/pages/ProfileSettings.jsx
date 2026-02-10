import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { FaUser, FaLock, FaEnvelope, FaSave, FaCamera, FaArrowLeft } from 'react-icons/fa';

const ProfileSettings = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Profile state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Loading states
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [activeTab, setActiveTab] = useState('profile');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const { data } = await API.put('/auth/profile', {
                name,
                email,
                bio
            });
            setUser(data.user);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return alert('New passwords do not match');
        }

        if (newPassword.length < 6) {
            return alert('Password must be at least 6 characters');
        }

        setSavingPassword(true);
        try {
            await API.put('/auth/password', {
                currentPassword,
                newPassword
            });
            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

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
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-xl" />
                    </div>
                    Profile Settings
                </h1>
                <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'profile'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FaUser className="inline mr-2" />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'security'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FaLock className="inline mr-2" />
                    Security
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-white/20 transition-colors">
                                    <FaCamera className="text-white text-sm" />
                                </button>
                            </div>
                            <div>
                                <p className="text-white font-medium">{user?.name}</p>
                                <p className="text-gray-400 text-sm">{user?.email}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {user?.role === 'instructor' ? '👨‍🏫 Instructor' : '👨‍🎓 Student'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave />
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Must be at least 6 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/5 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaLock />
                            {savingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
