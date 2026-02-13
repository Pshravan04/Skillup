import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    FaHome,
    FaBook,
    FaChartBar,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaSignOutAlt,
    FaTimes,
    FaCog
} from 'react-icons/fa';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = user?.role === 'instructor' ? [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/courses', icon: FaBook, label: 'Course Library' },
        { path: '/create-course', icon: FaChalkboardTeacher, label: 'Studio' },
        { path: '/gradebook', icon: FaChartBar, label: 'Analytics' },
        { path: '/instructor/profile', icon: FaUserGraduate, label: 'Identity' },
        { path: '/settings', icon: FaCog, label: 'Preferences' },
    ] : [
        { path: '/dashboard', icon: FaHome, label: 'Overview' },
        { path: '/courses', icon: FaBook, label: 'Explore' },
        { path: '/student/grades', icon: FaChartBar, label: 'Achievements' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ];

    if (!user) return null;

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 md:w-72 glass-card rounded-[2.5rem] flex flex-col z-50 transition-all duration-500 hover:shadow-brand-primary/5">
            {/* Logo Section */}
            <div className="h-24 flex items-center justify-center md:justify-start md:px-8">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-transform">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                    <span className="hidden md:block text-white font-black text-2xl tracking-tighter">SkillUp</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 overflow-y-auto">
                <ul className="space-y-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`relative flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 group ${isActive
                                        ? 'bg-brand-primary/10 text-brand-primary shadow-inner shadow-brand-primary/5'
                                        : 'text-discord-text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1.5 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    )}
                                    <item.icon className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:scale-110'}`} />
                                    <span className="hidden md:block font-bold tracking-tight">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Area */}
            <div className="p-4 mt-auto">
                <div className="glass-card p-4 rounded-[2rem] border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-0.5 shadow-lg">
                            <div className="w-full h-full bg-brand-dark rounded-full flex items-center justify-center overflow-hidden">
                                <span className="text-white text-xs font-black">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                            <p className="text-white text-sm font-bold truncate leading-none mb-1">{user?.name}</p>
                            <p className="text-discord-text-muted text-[10px] font-black uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-discord-text-muted hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 group"
                    >
                        <FaSignOutAlt className="text-base group-hover:scale-110 transition-transform" />
                        <span className="hidden md:block text-xs font-bold uppercase tracking-wider">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
