import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
    const defaultCategories = ['All', 'Web Development', 'Programming', 'Design', 'Backend', 'Marketing'];
    const tabs = categories || defaultCategories;

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200 ${activeCategory === category
                            ? 'bg-discord-blue text-white'
                            : 'bg-discord-gray text-discord-text-muted hover:bg-discord-light hover:text-white'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
