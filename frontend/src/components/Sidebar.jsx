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
        { path: '/courses', icon: FaBook, label: 'Courses' },
        { path: '/create-course', icon: FaChalkboardTeacher, label: 'Create Course' },
        { path: '/gradebook', icon: FaChartBar, label: 'Gradebook' },
        { path: '/instructor/profile', icon: FaUserGraduate, label: 'Profile' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ] : [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/courses', icon: FaBook, label: 'Courses' },
        { path: '/student/grades', icon: FaChartBar, label: 'My Grades' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ];

    if (!user) {
        return null;
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-64 bg-[#1a1d29] border-r border-white/5 flex flex-col z-50">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="hidden md:block text-white font-bold text-xl">SkillUp</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="text-lg shrink-0" />
                                    <span className="hidden md:block font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="hidden md:block flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <FaSignOutAlt className="text-lg shrink-0" />
                    <span className="hidden md:block font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
