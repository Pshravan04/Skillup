import React, { useState, useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import API from '../services/api';

const MentorsSection = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            // Fetch enrolled courses and extract unique instructors
            const { data } = await API.get('/courses/enrolled');

            const uniqueInstructors = [];
            const instructorIds = new Set();

            data.forEach(course => {
                if (course.instructor && !instructorIds.has(course.instructor._id)) {
                    instructorIds.add(course.instructor._id);
                    uniqueInstructors.push({
                        ...course.instructor,
                        role: `${course.category} Instructor`
                    });
                }
            });

            setMentors(uniqueInstructors.slice(0, 4)); // Show top 4
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (index) => {
        const colors = [
            'bg-gradient-to-br from-purple-500 to-pink-500',
            'bg-gradient-to-br from-blue-500 to-cyan-500',
            'bg-gradient-to-br from-orange-500 to-red-500',
            'bg-gradient-to-br from-green-500 to-teal-500'
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="bg-discord-gray rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Mentors</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-3 shimmer h-12 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-discord-gray rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Mentors</h3>
                <button className="text-discord-blue hover:text-discord-blue/80 text-sm font-semibold flex items-center gap-1 transition-colors">
                    See all
                    <FaChevronRight className="text-xs" />
                </button>
            </div>

            {/* Mentors List */}
            <div className="space-y-3">
                {mentors.length === 0 ? (
                    <p className="text-discord-text-muted text-sm text-center py-4">
                        No mentors found. Enroll in courses to see your instructors.
                    </p>
                ) : (
                    mentors.map((mentor, index) => (
                        <div
                            key={mentor._id}
                            className="flex items-center gap-3 hover:bg-discord-sidebar p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                {getInitials(mentor.name)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold text-sm truncate">
                                    {mentor.name}
                                </h4>
                                <p className="text-discord-text-muted text-xs truncate">
                                    {mentor.role}
                                </p>
                            </div>

                            {/* Experience Badge */}
                            <div className="text-discord-text-muted text-xs">
                                Exp {Math.floor(Math.random() * 5) + 3}y
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MentorsSection;
