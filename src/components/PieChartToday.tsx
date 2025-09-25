import React, { useState, useEffect } from 'react';

const PieChartToday: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate elapsed percentage of the day
  const now = currentTime;
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedMinutes = Math.floor((now.getTime() - startOfDay.getTime()) / (1000 * 60));
  const totalMinutesInDay = 24 * 60;
  const elapsedPercentage = (elapsedMinutes / totalMinutesInDay) * 100;

  // SVG constants
  const cx = 70;
  const cy = 70;
  const r = 65;
  const pointerRadius = 65;
  const svgSize = 140;

  // Arc calculations
  const angle = (elapsedPercentage / 100) * 360;
  const endAngle = (angle - 90) * (Math.PI / 180); // Start at top
  const x = cx + r * Math.cos(endAngle);
  const y = cy + r * Math.sin(endAngle);
  const largeArcFlag = angle > 180 ? 1 : 0;

  // Path for elapsed arc
  let arcPath = '';
  if (elapsedPercentage === 0) {
    arcPath = '';
  } else if (elapsedPercentage >= 100) {
    // Full circle
    arcPath = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  } else {
    arcPath = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y} Z`;
  }

  // Pointer triangle
  const pointerAngle = (elapsedPercentage / 100) * 360 - 90;
  const pointerRadians = (pointerAngle * Math.PI) / 180;
  const pointerX = cx + pointerRadius * Math.cos(pointerRadians);
  const pointerY = cy + pointerRadius * Math.sin(pointerRadians);
  // const pointerPoints = [
  //   `${pointerX},${pointerY - 4}`,
  //   `${pointerX + 3},${pointerY + 2}`,
  //   `${pointerX - 3},${pointerY + 2}`
  // ].join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="relative flex items-center justify-center mb-4" role="img" aria-label={`${(100 - elapsedPercentage).toFixed(1)}% of today remaining`}>
        <svg width={svgSize} height={svgSize} className="rotate-0" aria-hidden="true">
          {/* Background circle - white */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#fff"
            className="drop-shadow-sm"
          />
          {/* Elapsed time arc - dark */}
          {arcPath && (
            <path
              d={arcPath}
              fill="#1F2123"
              style={{ transition: 'd 0.5s ease-out' }}
            />
          )}
          {/* Pointer triangle */}
          <line
            x1={cx}
            y1={cy}
            x2={pointerX}
            y2={pointerY}
            stroke="#FF2058"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ transition: 'x2 0.5s, y2 0.5s' }}
          />
        </svg>
      </div>
      <div className="text-center" aria-live="polite">
        <div className="text-white text-sm font-medium">{(100 - elapsedPercentage).toFixed(1)}% of Time left Today</div>
        
      </div>
    </div>
  );
};

export default PieChartToday;