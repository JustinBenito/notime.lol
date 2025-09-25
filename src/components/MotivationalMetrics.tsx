import React, { useState, useEffect } from 'react';

const MotivationalMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    mondaysLeft: 0,
    weekendsLeft: 0,
    sunrisesLeft: 0,
    fullMoonsLeft: 0,
    daysLeftToSayILoveYou: 0,
    secondsLeft: 0,
  });

  useEffect(() => {
    const calculateMetrics = () => {
      const now = new Date();
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      const totalDaysLeft = Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate Mondays left
      let mondaysLeft = 0;
      let current = new Date(now);
      while (current <= endOfYear) {
        if (current.getDay() === 1) mondaysLeft++;
        current.setDate(current.getDate() + 1);
      }

      // Calculate weekends left (Saturdays)
      let weekendsLeft = 0;
      current = new Date(now);
      while (current <= endOfYear) {
        if (current.getDay() === 6) weekendsLeft++;
        current.setDate(current.getDate() + 1);
      }

      // Full moons left (approximate - lunar cycle is ~29.53 days)
      const fullMoonsLeft = Math.floor(totalDaysLeft / 29.53);

      // Seconds left this year
      const secondsLeft = Math.floor((endOfYear.getTime() - now.getTime()) / 1000);

      setMetrics({
        mondaysLeft,
        weekendsLeft,
        sunrisesLeft: totalDaysLeft,
        fullMoonsLeft,
        daysLeftToSayILoveYou: totalDaysLeft,
        secondsLeft,
      });
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="p-4 space-y-3" role="region" aria-label="Motivational metrics" aria-live="polite">
      
      <div className="flex items-center space-x-2">
        <span className="font-bold text-sm text-rose-500">{formatNumber(metrics.weekendsLeft)}</span>
        <span className="text-white text-sm">Weekends left</span>
        <span className="text-red-400 text-sm">🎉</span>
        <span className="text-gray-400 text-sm ml-auto"></span>
      </div>
    
      
      <div className="flex items-center space-x-2">
        <span className="font-bold text-rose-500 text-sm">{formatNumber(metrics.fullMoonsLeft)}</span>
        <span className="text-white text-sm">Full moons left</span>
        <span className="text-yellow-300 text-sm">🌕</span>
        <span className="text-gray-400 text-sm ml-auto"></span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="font-bold text-rose-500 text-sm">{formatNumber(metrics.daysLeftToSayILoveYou)}</span>
        <span className="text-white text-sm">Days left to say "I love you"</span>
        <span className="text-rose-400 text-sm">💕</span>
        <span className="text-gray-400 text-sm ml-auto"></span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="font-bold text-rose-500 text-sm">{formatNumber(metrics.secondsLeft)}</span>
        <span className="text-white text-sm">Seconds left to be happy</span>
        <span className="text-blue-400 text-sm">⏱️</span>
        <span className="text-gray-400 text-sm ml-auto"></span>
      </div>
    </div>
  );
};

export default MotivationalMetrics;
