import React from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';

const CourseCard = ({
    course,
    gradient = 'blue',
    onClick
}) => {
    const gradientClasses = {
        orange: 'from-orange-500/20 to-red-500/20',
        blue: 'from-blue-500/20 to-purple-500/20',
        red: 'from-pink-500/20 to-red-500/20',
        purple: 'from-purple-500/20 to-pink-500/20',
        teal: 'from-teal-500/20 to-blue-500/20'
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const formatPrice = (price) => {
        return price ? `$${price.toFixed(0)}` : 'Free';
    };

    return (
        <div
            className="group bg-[#1a1d29]/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer"
            onClick={() => onClick && onClick(course)}
        >
            {/* Course Image - Minimal Overlay */}
            <div className="relative h-44 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} opacity-60`}></div>
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Minimal Price Badge */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-sm font-semibold border border-white/10">
                    {course.originalPrice && (
                        <span className="line-through text-gray-400 text-xs mr-1.5">
                            {formatPrice(course.originalPrice)}
                        </span>
                    )}
                    <span>{formatPrice(course.price)}</span>
                </div>

                {/* Subtle Icon */}
                <div className="absolute top-3 left-3 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
            </div>

            {/* Course Content - Clean Spacing */}
            <div className="p-5">
                {/* Title and Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-white font-semibold text-base flex-1 line-clamp-2 leading-snug">
                        {course.title}
                    </h3>
                    {course.rating > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20 shrink-0">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-white font-medium text-xs">{course.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Description - Subtle */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>

                {/* Footer - Minimal */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                        <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            {course.category || 'General'}
                        </span>
                        {course.level && (
                            <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                {course.level}
                            </span>
                        )}
                    </div>

                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-blue-500 transition-colors border border-white/5 group-hover:border-blue-500">
                        <FaArrowRight className="text-xs text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
