import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DeathCalendarProps {}

const DeathCalendar: React.FC<DeathCalendarProps> = () => {
  const [birthDate, setBirthDate] = useLocalStorage<string>('death-calendar-birthday', '');
  const [lifeExpectancy, setLifeExpectancy] = useLocalStorage<number>('death-calendar-life-expectancy', 70);

  const calculateWeeksLived = () => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const totalWeeks = lifeExpectancy * 52;
  const weeksLived = calculateWeeksLived();
  const percentageLived = birthDate ? ((weeksLived / totalWeeks) * 100).toFixed(1) : 0;

  const renderGrid = () => {
    const squares = [];
    for (let i = 0; i < totalWeeks; i++) {
      const isLived = i < weeksLived;
      squares.push(
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded ${
            isLived ? 'bg-white' : 'bg-gray-700'
          }`}
        />
      );
    }
    return squares;
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-bricolage mb-3">Time Left to Die</h2>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Birthday</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-gray-800 text-white text-xs p-1 rounded border border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Life Expectancy</label>
            <div className="flex items-center">
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="bg-gray-800 text-white text-xs p-1 rounded border border-gray-600 w-16"
                min="1"
                max="120"
              />
              <span className="text-xs text-gray-400 ml-1">years</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-2">52 Weeks</div>
        <div 
          className="grid gap-0.5 bg-black p-2 rounded mb-2"
          style={{ 
            gridTemplateColumns: `repeat(52, minmax(0, 1fr))`,
            width: '100%'
          }}
        >
          {renderGrid()}
        </div>
        <div className="text-xs text-gray-400">{lifeExpectancy} Years</div>
        {birthDate && (
          <div className="text-red-400 font-bold text-sm mt-2">{percentageLived}% of your life is gone</div>
        )}
      </div>
    </div>
  );
};

export default DeathCalendar;
