import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (user) {
        return (
            <header className="fixed top-4 left-24 md:left-80 right-4 h-20 glass-card rounded-[2.5rem] flex items-center justify-between px-8 z-40">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-black text-xl tracking-tight hidden sm:block">
                        Workspace
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    <button className="hidden sm:flex glass-button px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-discord-text-muted hover:text-white">
                        Join Community
                    </button>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center glass-card hover:border-brand-primary/50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl glass-card px-8 h-20 rounded-[2.5rem] flex items-center justify-between z-[100] transition-all duration-300">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-transform">S</div>
                <span className="text-white font-black text-xl tracking-tighter">SkillUp</span>
            </Link>

            <ul className="hidden md:flex items-center gap-8 font-bold text-sm text-discord-text-muted">
                <li><Link to="/courses" className="hover:text-white transition-colors">Course Catalog</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Instructor Hub</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Enterprise</Link></li>
            </ul>

            <div className="flex items-center gap-4">
                <Link to="/login" className="px-6 py-2.5 font-bold text-sm text-white hover:text-brand-primary transition-colors">
                    Login
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-primary/20 transition-all transform hover:-translate-y-0.5">
                    Sign Up
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
