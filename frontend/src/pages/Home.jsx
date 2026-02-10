import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaRocket, FaGraduationCap, FaChartLine, FaUsers, FaStar, FaArrowRight, FaPlay } from 'react-icons/fa';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const stats = [
        { icon: FaUsers, value: '10,000+', label: 'Active Students' },
        { icon: FaGraduationCap, value: '500+', label: 'Expert Instructors' },
        { icon: FaChartLine, value: '95%', label: 'Success Rate' },
        { icon: FaStar, value: '4.9/5', label: 'Average Rating' },
    ];

    const features = [
        {
            icon: FaRocket,
            title: 'Learn at Your Pace',
            description: 'Access courses anytime, anywhere with lifetime access.',
        },
        {
            icon: FaGraduationCap,
            title: 'Expert Instructors',
            description: 'Learn from industry professionals with real-world experience.',
        },
        {
            icon: FaChartLine,
            title: 'Track Progress',
            description: 'Monitor your journey with detailed analytics and reports.',
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
        <div className="min-h-screen">
            {/* Hero Section - Minimal */}
            <section className="relative overflow-hidden py-24 px-4">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    {/* Minimal Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-8 border border-white/10">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span className="text-gray-400 text-sm font-medium">Join 10,000+ learners</span>
                    </div>

                    {/* Clean Heading */}
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Master New Skills,
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                            Transform Your Career
                        </span>
                    </h1>

                    {/* Subtle Subheading */}
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Learn from industry experts and advance your career with comprehensive online courses.
                    </p>

                    {/* Minimal CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
                        <button
                            onClick={handleGetStarted}
                            className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-orange-500/20"
                        >
                            {user ? 'Browse Courses' : 'Get Started'}
                            <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <Link
                            to="/courses"
                            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/10"
                        >
                            <FaPlay className="text-xs" />
                            Explore Courses
                        </Link>
                    </div>

                    {/* Minimal Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl transition-all duration-200 border border-white/5"
                            >
                                <stat.icon className="text-2xl text-orange-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - Clean */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">Why Choose SkillUp?</h2>
                        <p className="text-gray-400">Everything you need to succeed</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 hover:bg-white/10 p-8 rounded-2xl transition-all duration-200 border border-white/5"
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                    <feature.icon className="text-xl text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Minimal */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 p-12 rounded-3xl text-center border border-white/10">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Join thousands of students already learning on SkillUp
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3.5 px-10 rounded-xl transition-all duration-200 border border-orange-500/20"
                        >
                            {user ? 'Start Learning Now' : 'Sign Up for Free'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
