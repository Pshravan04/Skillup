import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaGraduationCap, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { ButtonLoader } from '../components/Loader';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4 relative overflow-hidden font-jakarta">
            {/* Immersive Background */}
            <div className="aurora-gradient absolute inset-0 opacity-40"></div>
            <div className="absolute inset-0 bg-brand-darker/60 backdrop-blur-[100px]"></div>

            <div className="relative w-full max-w-md fade-in py-12">
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-premium rounded-[2rem] mb-6 shadow-2xl shadow-brand-primary/20 group hover:scale-110 transition-transform duration-500">
                        <FaGraduationCap className="text-white text-4xl" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Join SkillUp</h1>
                    <p className="text-discord-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Initiate your educational trajectory</p>
                </div>

                {/* Register Card */}
                <div className="glass-card p-10 rounded-[3rem] border-white/10 shadow-3xl bg-white/[0.01]">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-xs font-bold tracking-tight">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest mb-3 ml-1">
                                Identity
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <FaUser className="text-discord-text-muted group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full glass-input pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-white placeholder:text-discord-text-muted/40 transition-all border-white/5 focus:border-brand-primary/50"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest mb-3 ml-1">
                                Matrix ID
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
                            <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest mb-3 ml-1">
                                Secure Key
                            </label>
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
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-[10px] font-black text-discord-text-muted uppercase tracking-widest mb-4 ml-1">
                                Operational Mode
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`p-6 rounded-[2rem] border-2 transition-all group ${role === 'student'
                                        ? 'border-brand-primary bg-brand-primary/10'
                                        : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                        }`}
                                >
                                    <FaUserGraduate className={`text-2xl mx-auto mb-3 ${role === 'student' ? 'text-brand-primary' : 'text-discord-text-muted group-hover:text-white'
                                        }`} />
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${role === 'student' ? 'text-white' : 'text-discord-text-muted group-hover:text-white'
                                        }`}>
                                        Student
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('instructor')}
                                    className={`p-6 rounded-[2rem] border-2 transition-all group ${role === 'instructor'
                                        ? 'border-brand-primary bg-brand-primary/10'
                                        : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                        }`}
                                >
                                    <FaChalkboardTeacher className={`text-2xl mx-auto mb-3 ${role === 'instructor' ? 'text-brand-primary' : 'text-discord-text-muted group-hover:text-white'
                                        }`} />
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${role === 'instructor' ? 'text-white' : 'text-discord-text-muted group-hover:text-white'
                                        }`}>
                                        Architect
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-premium text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading && <ButtonLoader />}
                            {loading ? 'Initializing...' : 'Construct Profile'}
                        </button>
                    </form>


                    <div className="mt-6">
                        <GoogleLoginButton text="Sign up with Google" />
                    </div>

                    {/* Login Link */}
                    <div className="mt-10 text-center">
                        <p className="text-discord-text-muted text-[10px] font-black uppercase tracking-widest">
                            Already Authenticated?{' '}
                            <Link
                                to="/login"
                                className="text-brand-primary hover:text-white transition-colors"
                            >
                                Secure Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-col items-center gap-4 opacity-40">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] text-center">
                        Verified Operator Infrastructure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
