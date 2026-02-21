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
- Motivational metrics (weekends left, full moons left, etc.)
- Persistent storage of goals using localStorage
- Responsive, modern UI with custom font and color themes

## Contributing 🤝

We welcome contributions! Follow these steps to get started:

### 1. Fork the Repository

Click the **Fork** button at the top-right corner of this GitHub page. This creates your own copy of the project under your GitHub account.

### 2. Clone Your Forked Repository

Open your terminal and run the following command (replace `<your-username>` with your GitHub username):

```bash
git clone https://github.com/<your-username>/notime.lol.git
```

Then navigate into the project folder:

```bash
cd notime.lol
```

### 3. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

This will download all the packages the project needs to run.

### 4. Start the Development Server

Run the following command to start the app locally:

```bash
npm run dev
```

### 5. Open in Browser

Once the server starts, open your browser and go to:

```
http://localhost:5173
```

(Or the URL shown in your terminal)

You should now see the app running locally! 🎉

### 6. Make Your Changes

Create a new branch for your feature or fix:

```bash
git checkout -b responsive-fix

Make your changes, then commit them:

```bash
git add .
git commit -m "Add my awesome feature"
```

### 7. Push and Create a Pull Request

Push your branch to your forked repository:

```bash
git push origin responsive-fix
```

Then go to the original repository on GitHub and click **New Pull Request** to submit your changes for review.

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
