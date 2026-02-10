import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await API.post(`/auth/reset-password/${token}`, { password });
            alert('Password reset successful! You can now log in with your new password.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-discord-dark">
            <div className="bg-discord-gray p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-discord-green/10 text-discord-green rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-discord-text-muted text-sm">
                        Enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="bg-discord-red/10 border border-discord-red text-discord-red p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full bg-discord-sidebar border-none text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="w-full bg-discord-sidebar border-none text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-discord-green hover:bg-discord-green/80 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? 'Resetting...' : (
                            <>
                                <FaCheckCircle className="mr-2" /> Reset Password
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-discord-text-muted">
                    Remember your password? <Link to="/login" className="text-discord-blue hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
