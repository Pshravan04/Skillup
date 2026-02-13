import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaSearch, FaStar } from 'react-icons/fa';
import CourseCard from '../components/CourseCard';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await API.get('/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ['All', 'Development', 'Design', 'Business', 'Marketing'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="text-discord-text-muted font-bold tracking-widest uppercase text-xs">Curating Catalog...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in space-y-12">
            {/* Catalog Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">Course Catalog</h1>
                    <p className="text-discord-text-muted font-medium text-lg leading-none">
                        Explore <span className="text-white font-black">{filteredCourses.length}</span> curated modules for mastery.
                    </p>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="glass-card p-4 md:p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
                {/* Search Box */}
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-discord-text-muted" />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        className="w-full glass-input pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-white placeholder:text-discord-text-muted/50 tracking-tight"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === category
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'glass-button text-discord-text-muted hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Matrix Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            gradient={['primary', 'secondary', 'accent', 'premium', 'emerald'][index % 5]}
                            onClick={() => navigate(`/course/${course._id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/5 mx-auto max-w-2xl bg-white/[0.01]">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <FaSearch className="text-2xl text-discord-text-muted" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight italic">No Modules Found</h3>
                    <p className="text-discord-text-muted font-bold leading-relaxed mb-10 px-8">
                        The search query returned an empty matrix. Adjust your parameters and try again.
                    </p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        className="px-10 py-4 glass-button text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all"
                    >
                        Reset Matrix
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseList;
