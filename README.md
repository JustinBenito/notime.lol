# notime.lol

![alt text](src/assets/timeleft_productimage.png)

## Overview

notime.lol is a time visualization dashboard built with React, TypeScript, Tailwind CSS, and Vite. It helps you track how much time is left in your day, week, month, and year using beautiful, interactive visualizations. You can also set and track personal goals for specific days, making it a practical tool for motivation and planning.

## Features

- Visualize the percentage of the day left with a dynamic pie chart
- See how many days are left in the week with a horizontal bar chart
- Track your progress through the months of the year
- View a grid of all days in the year, with color-coded goals
- Add, view, and remove goals for any day
- Death calendar showing weeks lived vs weeks remaining in your lifetime
- Motivational metrics (weekends left, full moons left, etc.)
- Persistent storage of goals using localStorage
- Responsive, modern UI with custom font and color themes

## Contributing ?

0. Fork this repository

1. Clone the repository:
   ```bash
   git clone https://github.com/<youruserid>/notime.lol.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173` (or the port shown in your terminal).

## Usage

- Click on any day in the yearly grid to add a goal for that day.
- View your goals in the right sidebar and remove them as needed.
- Watch the visualizations update in real time as the day, week, and year progress.

## Project Structure

```
notime.lol/
  ├── src/
  │   ├── components/
  │   │   ├── PieChartToday.tsx
  │   │   ├── DaysLeftWeek.tsx
  │   │   ├── MonthsLeftYear.tsx
  │   │   ├── YearlyDotsGrid.tsx
  │   │   ├── GoalTracker.tsx
  │   │   ├── MotivationalMetrics.tsx
  │   │   └── DotMatrixClock.tsx
  │   ├── hooks/
  │   │   └── useLocalStorage.ts
  │   ├── App.tsx
  │   ├── main.tsx
  │   └── index.css
  ├── index.html
  ├── tailwind.config.js
  ├── package.json
  └── ...
```

## Main Components

### PieChartToday

Shows a pie chart representing the percentage of the day left. The arc fills as the day progresses, and a pointer marks the current time.

```tsx
const PieChartToday: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  // ...calculations for arc and pointer...
  return (
    <svg>
      {/* Background circle */}
      {/* Elapsed time arc */}
      {/* Pointer triangle */}
    </svg>
  );
};
```

This component updates every second to reflect the current time.

### DaysLeftWeek

Displays a horizontal bar chart showing how many days are left in the current week.

```tsx
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
return (
  <div>
    {days.map((day, index) => (
      <div
        key={day}
        className={index <= currentDay ? "bg-gray-400 opacity-20" : "bg-white"}
      />
    ))}
    <div>{7 - currentDay - 1} Days left this Week</div>
  </div>
);
```

### MonthsLeftYear

Shows a vertical bar chart for each month, filling up as the month progresses. Completed months are fully filled, the current month is partially filled, and future months are empty.

```tsx
const months = [...];
return (
  <div>
    {months.map((month, index) => (
      <div key={index}>
        <div className={getBarFillClass(month)} style={{ height: getBarFillHeight(month) }} />
        <span>{month.abbreviation}</span>
      </div>
    ))}
    <div>{getRemainingMonths()} Months left this year</div>
  </div>
);
```

### YearlyDotsGrid

Displays a grid of all days in the year. Each dot represents a day. Dots with goals are colored according to the goal, and hovering shows a tooltip with the date and goal.

```tsx
const renderDots = () => {
  for (let i = 0; i < daysInYear; i++) {
    // ...
    <div
      className={goal ? "" : getDotColor(date, dateString)}
      style={goal ? { backgroundColor: goal.color } : {}}
      onClick={() => onDayClick(dateString)}
    />;
  }
};
```

### GoalTracker

Lets you add, view, and remove goals for specific days. Each goal is assigned a pastel color and shown in a list.

```tsx
const colors = [
  /* pastel hex codes */
];
const handleSubmit = (e) => {
  // ...
  onGoalAdd({ text: newGoal, date: goalDate, color: randomColor });
};
return (
  <div>
    {goals.map((goal) => (
      <div key={goal.id}>
        <div style={{ backgroundColor: goal.color }} />
        <div>{goal.text}</div>
      </div>
    ))}
  </div>
);
```

### MotivationalMetrics

Shows fun and motivational stats, such as weekends left, full moons left, and seconds left in the year.

```tsx
const [metrics, setMetrics] = useState({
  mondaysLeft: 0,
  weekendsLeft: 0,
  sunrisesLeft: 0,
  fullMoonsLeft: 0,
  daysLeftToSayILoveYou: 0,
  secondsLeft: 0,
});
```

### DotMatrixClock

A digital clock rendered in a dot-matrix style.

```tsx
const DotMatrix = ({ char }) => {
  // ...pattern for each digit/colon...
  return (
    <div className="grid grid-cols-3">{...}</div>
  );
};
```

### DeathCalendar

Displays a death calendar showing weeks lived vs weeks remaining in your lifetime. Users can input their birthday and life expectancy to visualize their mortality.

```tsx
const DeathCalendar: React.FC = () => {
  const [birthDate, setBirthDate] = useLocalStorage<string>('death-calendar-birthday', '');
  const [lifeExpectancy, setLifeExpectancy] = useLocalStorage<number>('death-calendar-life-expectancy', 70);
  
  const calculateWeeksLived = () => {
    // Calculate weeks lived based on birth date
  };
  
  const renderGrid = () => {
    // Render 52x70 grid of weeks with filled squares for weeks lived
  };
  
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}>
      {renderGrid()}
    </div>
  );
};
```

### useLocalStorage Hook

A custom React hook for persisting state to localStorage.

```ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // ...
  });
  // ...
  return [storedValue, setValue] as const;
}
```

## Customization

- The project uses Tailwind CSS for styling. You can adjust colors, fonts, and layout in `tailwind.config.js`.
- The custom font "Bricolage Grotesque" is loaded via Google Fonts in `index.html` and used via the `font-bricolage` class.
- You can add more pastel colors for goals in `GoalTracker.tsx`.

## License

This project is open source and available under the GPL License.
