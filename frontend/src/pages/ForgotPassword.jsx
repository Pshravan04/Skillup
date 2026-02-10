import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await API.post('/auth/forgot-password', { email });
            setMessage(data.message || 'Password reset link has been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-discord-dark">
            <div className="bg-discord-gray p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-discord-blue/10 text-discord-blue rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaEnvelope className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                    <p className="text-discord-text-muted text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="bg-discord-red/10 border border-discord-red text-discord-red p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-discord-green/10 border border-discord-green text-discord-green p-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full bg-discord-sidebar border-none text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-discord-blue hover:bg-discord-blue/80 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <Link to="/login" className="flex items-center justify-center text-sm text-discord-text-muted hover:text-white transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
