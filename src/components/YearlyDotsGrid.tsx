import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  text: string;
  date: string;
  color: string;
}

interface YearlyDotsGridProps {
  goals: Goal[];
  onDayClick: (date: string) => void;
}

const YearlyDotsGrid: React.FC<YearlyDotsGridProps> = ({ goals, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(timer);
  }, []);

  const getDaysInYear = (year: number) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeapYear ? 366 : 365;
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForTooltip = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const year = currentDate.getFullYear();
  const daysInYear = getDaysInYear(year);
  const today = getDateString(currentDate);

  const getGoalForDate = (dateString: string) => {
    return goals.find(goal => goal.date === dateString);
  };

  const getDotColor = (date: Date, dateString: string) => {
    const goal = getGoalForDate(dateString);
    if (goal) return goal.color;
    
    if (dateString === today) return 'bg-rose-500';
    if (date < currentDate) return 'bg-gray-400 opacity-20';
    return 'bg-white';
  };

  const renderDots = () => {
    const dots = [];
    const startDate = new Date(year, 0, 1);

    for (let i = 0; i < daysInYear; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = getDateString(date);
      const goal = getGoalForDate(dateString);

      dots.push(
        <div
          key={i}
          className="relative flex items-center justify-center"
        >
          <div
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 ${!goal ? getDotColor(date, dateString) : ''}`}
            style={goal ? { backgroundColor: goal.color } : {}}
            onClick={() => onDayClick(dateString)}
            onMouseEnter={() => setHoveredDate(dateString)}
            onMouseLeave={() => setHoveredDate(null)}
          />
          {/* Tooltip on hover */}
          {hoveredDate === dateString && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none">
              {formatDateForTooltip(date)}
              {goal && (
                <div className="mt-1 text-gray-300">Goal: {goal.text}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return dots;
  };

  return (
    <div className="p-4 h-full">
      <div className="mb-3">
        <div className="text-white text-sm font-medium mb-1">Year {year}</div>
        <div className="text-gray-400 text-xs">
          {daysInYear} days • Click a day to add a goal
        </div>
      </div>
      <div className="grid grid-cols-26 gap-1 max-h-64 overflow-hidden">
        {renderDots()}
      </div>
    </div>
  );
};

export default YearlyDotsGrid;