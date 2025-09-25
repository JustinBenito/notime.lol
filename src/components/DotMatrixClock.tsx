import React, { useState, useEffect } from 'react';

const DotMatrixClock: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const DotMatrix = ({ char }: { char: string }) => {
    const patterns: { [key: string]: boolean[][] } = {
      '0': [
        [true, true, true],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, true, true],
      ],
      '1': [
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [false, true, false],
      ],
      '2': [
        [true, true, true],
        [false, false, true],
        [true, true, true],
        [true, false, false],
        [true, true, true],
      ],
      '3': [
        [true, true, true],
        [false, false, true],
        [true, true, true],
        [false, false, true],
        [true, true, true],
      ],
      '4': [
        [true, false, true],
        [true, false, true],
        [true, true, true],
        [false, false, true],
        [false, false, true],
      ],
      '5': [
        [true, true, true],
        [true, false, false],
        [true, true, true],
        [false, false, true],
        [true, true, true],
      ],
      '6': [
        [true, true, true],
        [true, false, false],
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ],
      '7': [
        [true, true, true],
        [false, false, true],
        [false, false, true],
        [false, false, true],
        [false, false, true],
      ],
      '8': [
        [true, true, true],
        [true, false, true],
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ],
      '9': [
        [true, true, true],
        [true, false, true],
        [true, true, true],
        [false, false, true],
        [true, true, true],
      ],
      ':': [
        [false, false, false],
        [false, true, false],
        [false, false, false],
        [false, true, false],
        [false, false, false],
      ],
    };

    const pattern = patterns[char] || patterns['0'];

    return (
      <div className="grid grid-cols-3 gap-1 mx-1">
        {pattern.map((row, rowIndex) =>
          row.map((dot, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-2 h-2 md:w-4 md:h-4 rounded-full transition-all duration-100 ${
                dot
                  ? (char === ':' ? 'bg-rose-500' : 'bg-white')
                  : 'bg-gray-400 opacity-20'
              }
              `}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center bg-black p-2" role="img" aria-label={`Current time: ${time}`} aria-live="polite">
        <div className="flex items-center">
          {time.split('').map((char, index) => (
            <DotMatrix key={index} char={char} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DotMatrixClock;