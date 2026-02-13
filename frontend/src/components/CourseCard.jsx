import React from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';

const CourseCard = ({
    course,
    gradient = 'primary',
    onClick
}) => {
    const gradientClasses = {
        primary: 'from-brand-primary to-brand-secondary',
        secondary: 'from-purple-500 to-indigo-500',
        accent: 'from-rose-500 to-pink-500',
        premium: 'from-brand-primary via-indigo-500 to-fuchsia-500',
        emerald: 'from-emerald-500 to-teal-500'
    };

    const formatPrice = (price) => {
        if (price === 0) return 'FREE';
        return price ? `$${price.toFixed(0)}` : 'FREE';
    };

    return (
        <div
            className="group glass-card rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
            onClick={() => onClick && onClick(course)}
        >
            {/* Visual Header */}
            <div className="relative h-56 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient] || gradientClasses.primary} opacity-30 group-hover:opacity-40 transition-opacity duration-500`}></div>
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Glowing Overlay for active feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60"></div>

                {/* Floating Status Badge */}
                <div className="absolute top-5 left-5 glass-card px-4 py-2 rounded-2xl border-white/20 shadow-xl">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">
                        {course.category || 'Module 01'}
                    </span>
                </div>

                {/* Glass Price Tag */}
                <div className="absolute bottom-5 right-5 glass-card px-6 py-2.5 rounded-2xl border-white/20 shadow-2xl flex flex-col items-end">
                    {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-[10px] text-discord-text-muted line-through font-bold mb-0.5">
                            {formatPrice(course.originalPrice)}
                        </span>
                    )}
                    <span className="text-white font-black text-sm tracking-tight">
                        {formatPrice(course.price)}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-white font-black text-xl tracking-tighter leading-[1.1] mb-3 group-hover:text-brand-primary transition-colors">
                        {course.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex text-brand-primary text-[10px]">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <FaStar key={s} className={s <= (course.rating || 5) ? 'text-brand-primary' : 'text-white/5'} />
                            ))}
                        </div>
                        <span className="text-discord-text-muted text-[10px] font-black uppercase tracking-widest">
                            ({course.enrolledStudents?.length || 0} Students)
                        </span>
                    </div>
                </div>

                <p className="text-discord-text-muted text-sm font-medium line-clamp-2 leading-relaxed mb-8 italic">
                    {course.description || "No description provided for this premium learning module."}
                </p>

                {/* Master Footer */}
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-premium p-0.5 shadow-lg">
                            <div className="w-full h-full bg-brand-dark rounded-full flex items-center justify-center font-black text-white text-[8px]">
                                {course.instructor?.name?.charAt(0) || 'I'}
                            </div>
                        </div>
                        <span className="text-white text-xs font-bold truncate max-w-[100px]">{course.instructor?.name}</span>
                    </div>

                    <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                        <FaArrowRight className="text-discord-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
