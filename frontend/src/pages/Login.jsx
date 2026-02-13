import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGraduationCap } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { ButtonLoader } from '../components/Loader';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4 relative overflow-hidden font-jakarta">
            {/* Immersive Background */}
            <div className="aurora-gradient absolute inset-0 opacity-40"></div>
            <div className="absolute inset-0 bg-brand-darker/60 backdrop-blur-[100px]"></div>

            <div className="relative w-full max-w-md fade-in">
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-premium rounded-[2rem] mb-6 shadow-2xl shadow-brand-primary/20 group hover:scale-110 transition-transform duration-500">
                        <FaGraduationCap className="text-white text-4xl" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Welcome Back</h1>
                    <p className="text-discord-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Synchronize with your learning matrix</p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-10 rounded-[3rem] border-white/10 shadow-3xl bg-white/[0.01]">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-xs font-bold tracking-tight">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest mb-3 ml-1">
                                Credentials
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-discord-text-muted group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full glass-input pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-white placeholder:text-discord-text-muted/40 transition-all border-white/5 focus:border-brand-primary/50"
                                    placeholder="Matrix ID (Email)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-3 px-1">
                                <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest">
                                    Security Phase
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Recovery
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <FaLock className="text-discord-text-muted group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full glass-input pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-white placeholder:text-discord-text-muted/40 transition-all border-white/5 focus:border-brand-primary/50"
                                    placeholder="Encrypted Key"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading && <ButtonLoader />}
                            {loading ? 'Authenticating...' : 'Establish Connection'}
                        </button>
                    </form>


                    <div className="mt-6">
                        <GoogleLoginButton />
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-10 text-center">
                        <p className="text-discord-text-muted text-[10px] font-black uppercase tracking-widest">
                            New Recruit?{' '}
                            <Link
                                to="/register"
                                className="text-brand-primary hover:text-white transition-colors"
                            >
                                Initialize Profile
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-10 flex items-center justify-center gap-4 opacity-40">
                    <div className="h-px w-10 bg-white/20"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Node 256-AES</p>
                    <div className="h-px w-10 bg-white/20"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
