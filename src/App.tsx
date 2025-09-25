import { useState, useEffect, useRef} from 'react';
import PieChartToday from './components/PieChartToday';
import DaysLeftWeek from './components/DaysLeftWeek';
import MonthsLeftYear from './components/MonthsLeftYear';
import MotivationalMetrics from './components/MotivationalMetrics';
import DotMatrixClock from './components/DotMatrixClock';
import YearlyDotsGrid from './components/YearlyDotsGrid';
import GoalTracker from './components/GoalTracker';
import { useLocalStorage } from './hooks/useLocalStorage';
import GitHubButton from './components/GithubButton';
import logo from "./public/timeleft.png"
import { Swapy } from 'swapy';
import { createSwapy } from 'swapy';

interface Goal {
  id: string;
  text: string;
  date: string;
  color: string;
}

function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('timeleft-goals', []);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (containerRef.current) {
    swapyRef.current = createSwapy(containerRef.current, {
      swapMode: 'hover',
      autoScrollOnDrag: true,
      animation: 'spring',
    })
  }

  return () => {
    if (swapyRef.current) {
      swapyRef.current.destroy()
      swapyRef.current = null
    }
  }
}, [])

  const handleGoalAdd = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals([...goals, newGoal]);
  };

  const handleGoalRemove = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
  };

  return (

    <main className="flex overflow-y-auto flex-col min-h-screen bg-black text-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center pb-2 pr-2 sm:pr-4 flex-shrink-0" role="banner">
        <div className='flex flex-row gap-2 justify-center items-center'>
          <img src={logo} alt="notime app logo with a moon phasing out image" className='rounded-lg w-6 h-6 sm:w-8 sm:h-8' />
          <h1 className="font-bricolage items-center justify-center text-base sm:text-lg font-regular">no<span className='text-rose-500'>time</span>.lol</h1>
        </div>
        <GitHubButton />
      </header>

      {/* Main Grid - fills available space */}

      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-y-0" ref={containerRef}>
          {/* Top Row - Time Visualization */}
          <section className="flex-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-3" aria-label="Time Visualization">
          <h2 className="sr-only">Time Visualization Dashboard</h2>
            <div className="border-2 border-b-0 md:border-r-0 border-dashed border-gray-700 h-full" data-swapy-slot="pie">
              <div data-swapy-item="pie" className="h-full w-full">
                <PieChartToday />
              </div>
            </div>
            <div className="border-2 border-b-0 md:border-r-0 border-dashed border-gray-700 h-full" data-swapy-slot="week">
              <div data-swapy-item="week" className="h-full w-full">
                <DaysLeftWeek />
              </div>
            </div>
            <div className="border-2 border-b-0 border-dashed border-gray-700 h-full" data-swapy-slot="months">
              <div data-swapy-item="months" className="h-full w-full">
                <MonthsLeftYear />
              </div>

            </div>
          </section>
          {/* Middle Row - Metrics and Clock */}
          <section className="flex-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2" aria-label="Metrics and Clock">
          <h2 className="sr-only">Motivational Metrics and Digital Clock</h2>
            <div className="border-2 border-b-0 md:border-r-0 border-dashed border-gray-700 h-full" data-swapy-slot="metric">
              <div data-swapy-item="metric" className="h-full w-full">
                <MotivationalMetrics />
              </div>
            </div>
            <div className="border-2 border-b-0 border-dashed border-gray-700 h-full" data-swapy-slot="clock">
              <div data-swapy-item="clock" className="h-full w-full">
                <DotMatrixClock />
              </div>
            </div>
          </section>
          {/* Bottom Row - Year Grid and Goals */}
          <section className="flex-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2">
            <div className="border-2 border-b-0 md:border-b-2 md:border-r-0 border-dashed border-gray-700 h-full" data-swapy-slot="yearly">
              <div data-swapy-item="yearly" className="h-full w-full">
                <h2 className="sr-only">Year Overview and Goal Tracking</h2>
                <YearlyDotsGrid
                goals={goals}
                onDayClick={handleDayClick}
              />
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-700 h-full" data-swapy-slot="goals">
              <div data-swapy-item="goals" className="h-full w-full">
                <GoalTracker 
                goals={goals}
                onGoalAdd={handleGoalAdd}
                onGoalRemove={handleGoalRemove}
                selectedDate={selectedDate}
              />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className='flex w-full flex-col items-center justify-center px-2 py-2 text-white  sm:px-4 md:px-8 lg:px-16 flex-shrink-0' role="contentinfo">
        <div className='text-center'>
          <div className="text-sm sm:text-base">
            Made with 🩵 by
            <a href='https://www.linkedin.com/in/justinbenito/' className='ml-2 underline text-[#b5f4ff]'>Justin Benito</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
