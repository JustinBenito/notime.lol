import React, { useState, useEffect } from 'react';

const DaysLeftWeek: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const updateCurrentDay = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      setCurrentDay(dayOfWeek);
    };

    updateCurrentDay();
    const interval = setInterval(updateCurrentDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full" role="region" aria-label="Days left in current week">
      <div className="space-y-2 mb-2" role="group" aria-label="Weekly progress bars">
        {days.map((day, index) => (
          <div
            key={day}
            className={`w-32 h-3 rounded-full transition-all duration-300 ${
              index < currentDay
                ? 'bg-[#1F2123]'
                : index === currentDay
                  ? 'bg-rose-500 opacity-100'
                  : 'bg-white'
            }`}
            role="img"
            aria-label={`${day}: ${
              index < currentDay
                ? 'completed'
                : index === currentDay
                  ? 'current day'
                  : 'remaining'
            }`}
          />
        ))}
      </div>
      <div className="text-center" aria-live="polite">
        <div className="text-white text-sm font-medium">{7 - currentDay - 1} Days left this Week</div>

      </div>
    </div>
  );
};

export default DaysLeftWeek;