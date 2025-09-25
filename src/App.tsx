import { useState } from 'react';
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

interface Goal {
  id: string;
  text: string;
  date: string;
  color: string;
}

function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('timeleft-goals', []);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

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
    <main className="flex overflow-hidden flex-col h-screen bg-black text-white p-2 sm:p-3">
      {/* Header */}
      <header className="flex justify-between items-center pb-2 pr-2 sm:pr-4 flex-shrink-0" role="banner">
        <div className='flex flex-row gap-2 justify-center items-center'>
          <img src={logo} alt="notime app logo with a moon phasing out image" className='rounded-lg w-6 h-6 sm:w-8 sm:h-8' />
          <h1 className="font-bricolage items-center justify-center text-base sm:text-lg font-regular">no<span className='text-rose-500'>time</span>.lol</h1>
        </div>
        <GitHubButton />
      </header>

      {/* Main Grid - fills available space */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto lg:overflow-y-hidden">
        <div className=" flex flex-col gap-y-0 h-full">
          {/* Top Row - Time Visualization */}
          <section className="lg:col-span-12 flex flex-col sm:flex-row h-fit" aria-label="Time Visualization">
            <h2 className="sr-only">Time Visualization Dashboard</h2>
            <div className="border-2 border-b-0 sm:border-r-0 py-3 border-dashed border-gray-700 overflow-hidden w-full sm:w-1/3">
              <PieChartToday />
            </div>
            <div className="border-2 border-b-0 sm:border-r-0 py-3 border-dashed border-gray-700 overflow-hidden w-full sm:w-1/3">
              <DaysLeftWeek />
            </div>
            <div className="border-2 border-b-0 py-3 border-dashed border-gray-700 overflow-hidden h-1/3 sm:h-full w-full sm:w-1/3">
              <MonthsLeftYear />
            </div>
          </section>
          {/* Middle Row - Metrics and Clock */}
          <section className="lg:col-span-12 flex flex-col sm:flex-row" aria-label="Metrics and Clock">
            <h2 className="sr-only">Motivational Metrics and Digital Clock</h2>
            <div className="border-2 border-b-0 sm:border-r-0 border-dashed border-gray-700 h-fit overflow-hidden w-full sm:w-1/2">
              <MotivationalMetrics />
            </div>
            <div className="border-2 border-b-0 border-dashed border-gray-700 overflow-hidden w-full sm:w-1/2">
              <DotMatrixClock />
            </div>
          </section>
          {/* Bottom Row - Year Grid and Goals */}
          <section className="lg:col-span-12 flex flex-col sm:flex-row h-fit" aria-label="Year Overview and Goals">
            <h2 className="sr-only">Year Overview and Goal Tracking</h2>
            <div className="border-2 border-b-0 sm:border-b-2 sm:border-r-0 border-dashed h-full border-gray-700 pb-7 w-full sm:w-1/2 overflow-hidden ">
              <YearlyDotsGrid 
                goals={goals} 
                onDayClick={handleDayClick}
              />
            </div>
            <div className="border-2 border-dashed border-gray-700 overflow-hidden h-full w-full sm:w-1/2">
              <GoalTracker 
                goals={goals}
                onGoalAdd={handleGoalAdd}
                onGoalRemove={handleGoalRemove}
                selectedDate={selectedDate}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className='flex w-full flex-col items-center justify-center px-2 py-2 text-white  sm:px-4 md:px-8 lg:px-16 flex-shrink-0' role="contentinfo">
        <div className='text-center'>
          <div className="text-sm sm:text-base">
            Made with 🩵 by
            <a href='https://www.linkedin.com/in/justinbenito/' className='ml-2 text-[#b5f4ff]'>Justin Benito</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;