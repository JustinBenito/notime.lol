import React, { useState, useEffect } from 'react';

interface MonthData {
  name: string;
  abbreviation: string;
  progress: number; // 0-1, where 1 is completed
  status: 'completed' | 'current' | 'remaining';
}

const MonthsLeftYear: React.FC = () => {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  useEffect(() => {
    const updateMonths = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11
      const currentDay = now.getDate();
      
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const monthAbbreviations = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
      ];

      const monthsData: MonthData[] = monthNames.map((name, index) => {
        let progress = 0;
        let status: 'completed' | 'current' | 'remaining' = 'remaining';

        if (index < currentMonth) {
          progress = 1;
          status = 'completed';
        } else if (index === currentMonth) {
          const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
          progress = Math.min(currentDay / daysInMonth, 1);
          status = 'current';
        } else {
          progress = 0;
          status = 'remaining';
        }

        return {
          name,
          abbreviation: monthAbbreviations[index],
          progress,
          status
        };
      });

      setMonths(monthsData);
    };

    updateMonths();
    const interval = setInterval(updateMonths, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const getBarFillClass = (month: MonthData) => {
    if (month.status === 'completed') return 'bg-[#1F2123]';
    if (month.status === 'current') return 'bg-[#1F2123]';
    return 'bg-transparent';
  };

  const getBarFillHeight = (month: MonthData) => {
    if (month.status === 'completed') return '100%';
    if (month.status === 'current') return `${month.progress * 100}%`;
    return '0%';
  };

  const getRemainingMonths = () => months.filter(m => m.status === 'remaining').length;

  return (
    <div className="w-full h-full bg-black rounded-xl p-2 gap-2 flex flex-col justify-between" role="img" aria-label={`Year progress: ${getRemainingMonths()} months remaining`}>
      <div className="flex-1 flex items-center gap-1  justify-between" role="group" aria-label="Monthly progress bars">
        {months.map((month, index) => (
          <div
            key={index}
            className="flex-1 h-full max-h-25 relative group cursor-pointer"
            onMouseEnter={() => setHoveredMonth(month.name)}
            onMouseLeave={() => setHoveredMonth(null)}
            role="img"
            aria-label={`${month.name}: ${month.status === 'completed' ? 'Completed' : month.status === 'current' ? `${Math.round(month.progress * 100)}% complete` : 'Remaining'}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setHoveredMonth(hoveredMonth === month.name ? null : month.name);
              }
            }}
          >
            {/* Bar background */}
            <div className="w-full h-full bg-white rounded-sm relative overflow-hidden">
              {/* Bar fill */}
              <div
                className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out ${getBarFillClass(month)}`}
                style={{ height: getBarFillHeight(month) }}
              />
              {/* Month abbreviation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-xs font-medium transform -rotate-90 whitespace-nowrap select-none ${month.status === 'completed' ? 'text-gray-200' : 'text-gray-400'} ${month.status === 'current' ? 'text-rose-500' : 'text-gray-400'}`}
                  style={{ fontSize: '10px', letterSpacing: '0.5px' }}
                >
                  {month.abbreviation}
                </span>
              </div>
            </div>
            {/* Hover tooltip */}
            {hoveredMonth === month.name && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1F2123] rounded-md px-2 py-1 shadow-lg z-10">
                <div className="text-xs text-gray-100 font-medium">
                  {month.name}
                </div>
                <div className="text-xs text-gray-400">
                  {month.status === 'completed' ? 'Completed' :
                   month.status === 'current' ? `${Math.round(month.progress * 100)}% done` :
                   'Remaining'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Label */}
      <div className="text-center">
        <div className="text-sm text-white font-medium">
        {getRemainingMonths()} Months left this year
        </div>
        
      </div>
    </div>
  );
};

export default MonthsLeftYear;