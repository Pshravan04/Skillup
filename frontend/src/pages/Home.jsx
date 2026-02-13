import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaRocket, FaGraduationCap, FaChartLine, FaUsers, FaStar, FaArrowRight, FaPlay } from 'react-icons/fa';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const stats = [
        { icon: FaUsers, value: '10K+', label: 'Active Learners' },
        { icon: FaGraduationCap, value: '500+', label: 'Expert Mentors' },
        { icon: FaChartLine, value: '95%', label: 'Course Completion' },
        { icon: FaStar, value: '4.9', label: 'Student Satisfaction' },
    ];

    const features = [
        {
            icon: FaRocket,
            title: 'Adaptive Learning',
            description: 'AI-driven paths tailored to your specific career goals.',
            color: 'from-blue-500/20 to-indigo-500/20'
        },
        {
            icon: FaGraduationCap,
            title: 'Elite Instructors',
            description: 'Learn from top-tier professionals shaping the industry.',
            color: 'from-purple-500/20 to-fuchsia-500/20'
        },
        {
            icon: FaChartLine,
            title: 'Real-time Growth',
            description: 'Advanced analytics to visualize every step of your progress.',
            color: 'from-rose-500/20 to-pink-500/20'
        },
    ];

    const handleGetStarted = () => {
        if (user) {
            navigate('/courses');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen selection:bg-indigo-500/30">
            {/* Nav Padding if necessary, assuming Layout handles it */}

            {/* Hero Section - High Design */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Aurora background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-fuchsia-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center fade-in">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 border border-white/10 glow-primary transition-transform hover:scale-105 active:scale-95 cursor-default">
                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping"></span>
                            <span className="text-brand-primary text-xs font-bold tracking-wider uppercase">Future of Learning</span>
                        </div>

                        {/* Title with extra weight and spacing */}
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
                            Unlock Your <br />
                            <span className="text-gradient">Potential</span>
                        </h1>

                        <p className="text-xl text-discord-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                            A next-generation learning platform designed for ambitious professionals. Master modern skills with a premium experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
                            <button
                                onClick={handleGetStarted}
                                className="w-full sm:w-auto px-10 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                {user ? 'Launch Dashboard' : 'Get Started Now'}
                                <FaArrowRight className="text-sm" />
                            </button>

                            <Link
                                to="/courses"
                                className="w-full sm:w-auto px-10 py-4 glass-button text-white font-bold rounded-2xl flex items-center justify-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <FaPlay className="text-[10px] ml-0.5" />
                                </div>
                                Browse Catalog
                            </Link>
                        </div>
                    </div>

                    {/* Bento Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 rounded-[2rem] text-center group hover:border-brand-primary/30 transition-all duration-500"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <stat.icon className="text-2xl text-brand-primary" />
                                </div>
                                <div className="text-4xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-sm text-discord-text-muted font-semibold tracking-wide uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features - Bento Style */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Designed for Excellence</h2>
                            <p className="text-discord-text-muted text-lg leading-relaxed">
                                We've rebuilt the online learning experience from the ground up, focusing on deep work and intuitive navigation.
                            </p>
                        </div>
                        <Link to="/register" className="text-brand-primary hover:text-brand-accent font-bold flex items-center gap-2 group transition-colors">
                            Explore all features <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`glass-card p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500`}
                            >
                                {/* Decorative background glow */}
                                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-primary/10 transition-colors duration-500">
                                    <feature.icon className="text-2xl text-white group-hover:text-brand-primary transition-colors" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{feature.title}</h3>
                                <p className="text-discord-text-muted leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High Impact CTA */}
            <section className="py-32 px-4">
                <div className="max-w-5xl mx-auto relative group">
                    {/* Background glow for CTA */}
                    <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -z-10"></div>

                    <div className="glass-card p-16 md:p-24 rounded-[3.5rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-grid-white/[0.02] -z-10"></div>

                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-[1.1]">
                            Start Your Journey <br />
                            <span className="text-gradient">Today.</span>
                        </h2>
                        <p className="text-xl text-discord-text-muted mb-12 max-w-xl mx-auto leading-relaxed">
                            Join over 10,000 students mastering the future with SkillUp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGetStarted}
                                className="px-12 py-5 bg-white text-brand-darker font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-white/10 hover:scale-105 active:scale-95"
                            >
                                {user ? 'Go to Dashboard' : 'Create Free Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder for visual completeness */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-brand-primary/20">S</div>
                        <span className="text-xl font-black text-white tracking-tight">SkillUp</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-discord-text-muted">
                        <a href="#" className="hover:text-white transition-colors">Courses</a>
                        <a href="#" className="hover:text-white transition-colors">Mentors</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
