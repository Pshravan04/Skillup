import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaUser } from 'react-icons/fa';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await API.get('/courses');
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory; 
        // Category filtering to be implemented when backend supports it
        return matchesSearch;
    });

    if (loading) return <div className="text-white text-center mt-10">Loading catalog...</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
                    <p className="text-discord-text-muted">Discover new skills and passions.</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FaSearch className="absolute left-3 top-3 text-discord-text-muted" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-discord-sidebar text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-discord-sidebar hover:bg-discord-light text-white p-2 rounded-lg transition-colors">
                        <FaFilter />
                    </button>
                </div>
            </div>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-discord-gray rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="h-40 bg-discord-light flex items-center justify-center overflow-hidden">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x200?text=No+Thumbnail'}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=SkillUp' }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-1">{course.title}</h3>
                                    <div className="flex items-center text-discord-gold text-xs font-bold bg-discord-gold/10 px-2 py-0.5 rounded">
                                        <FaStar className="mr-1" /> 4.5
                                    </div>
                                </div>

                                <p className="text-discord-text-muted text-sm mb-4 line-clamp-2">{course.description}</p>

                                <div className="flex items-center text-xs text-discord-text-muted mb-4">
                                    <FaUser className="mr-1" />
                                    <span>{course.instructor?.name || 'Unknown Instructor'}</span>
                                </div>

                                <div className="flex justify-between items-center border-t border-discord-light pt-4">
                                    <span className="text-white font-bold text-lg">${course.price}</span>
                                    <Link to={`/course/${course._id}`} className="text-discord-blue hover:text-white font-medium text-sm transition-colors">
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-xl text-white font-bold mb-2">No courses found</h3>
                    <p className="text-discord-text-muted">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
};

export default CourseList;
