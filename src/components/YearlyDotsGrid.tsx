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
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none focus:ring-2 focus:ring-rose-500 ${!goal ? getDotColor(date, dateString) : ''}`}
            style={goal ? { backgroundColor: goal.color } : {}}
            onClick={() => onDayClick(dateString)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDayClick(dateString);
              }
            }}
            onMouseEnter={() => setHoveredDate(dateString)}
            onMouseLeave={() => setHoveredDate(null)}
            onFocus={() => setHoveredDate(dateString)}
            onBlur={() => setHoveredDate(null)}
            tabIndex={0}
            role="button"
            aria-label={`${formatDateForTooltip(new Date(dateString))}${goal ? `, Goal: ${goal.text}` : ', Click to add goal'}`}
          />
        </div>
      );
    }

    return dots;
  };

  return (
    <div className="px-4 py-2 h-full relative">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-white text-sm font-medium mb-2">Year {year}</div>
        <div className="text-gray-400 text-xs">
          {daysInYear} days • Click a day to add a goal
        </div>
      </div>
      <div className="grid grid-cols-26 gap-0.5 max-h-70 overflow-visible">
        {renderDots()}
      </div>
      
      {/* Portal tooltip outside the grid */}
      {hoveredDate && (
        <div 
          className="fixed z-[9999] px-3 py-2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg shadow-2xl whitespace-nowrap pointer-events-none"
          style={{
            left: '25%',
            top: '68%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {formatDateForTooltip(new Date(hoveredDate))}
          {getGoalForDate(hoveredDate) && (
            <div className="mt-1 text-gray-300">Goal: {getGoalForDate(hoveredDate)?.text}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default YearlyDotsGrid;