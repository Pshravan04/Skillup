import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-6 h-6'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinner Animation */}
            <div className="relative">
                {/* Outer rotating ring */}
                <div className={`${sizes[size]} rounded-full border-4 border-white/10 border-t-blue-500 border-r-purple-500 animate-spin`}></div>

                {/* Inner pulsing circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`${dotSizes[size]} bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse`}></div>
                </div>
            </div>

            {/* Loading Text */}
            {text && (
                <p className="text-gray-400 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

// Full page loader
export const PageLoader = ({ text = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-discord-dark flex items-center justify-center z-50">
            <Loader size="lg" text={text} />
        </div>
    );
};

// Inline loader for sections
export const InlineLoader = ({ text = '' }) => {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader size="md" text={text} />
        </div>
    );
};

// Button loader (small spinner for buttons)
export const ButtonLoader = () => {
    return (
        <div className="inline-flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
    );
};

// Dots loader (alternative style)
export const DotsLoader = ({ size = 'md' }) => {
    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const gaps = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3'
    };

    return (
        <div className={`flex items-center ${gaps[size]}`}>
            <div className={`${dotSizes[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${dotSizes[size]} bg-purple-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${dotSizes[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
    );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-white/5 rounded-lg animate-pulse"
                    style={{ width: `${100 - (i * 10)}%` }}
                ></div>
            ))}
        </div>
    );
};

export default Loader;
