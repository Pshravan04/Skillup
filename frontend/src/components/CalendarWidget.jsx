import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CalendarWidget = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (date) => {
        if (date) {
            setSelectedDate(date);
            onDateSelect && onDateSelect(date);
        }
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={handlePrevMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        aria-label="Previous month"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        aria-label="Next month"
                    >
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                    <div key={day} className="text-center text-gray-500 text-[10px] font-semibold py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        disabled={!date}
                        className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                            ${!date ? 'invisible' : ''}
                            ${date && !isToday(date) && !isSelected(date) ? 'text-gray-300 hover:bg-white/10' : ''}
                            ${isToday(date) && !isSelected(date) ? 'bg-white/10 text-white font-semibold ring-1 ring-white/20' : ''}
                            ${isSelected(date) ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold' : ''}
                            ${date && !isSelected(date) ? 'cursor-pointer' : ''}
                        `}
                    >
                        {date ? date.getDate() : ''}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CalendarWidget;
