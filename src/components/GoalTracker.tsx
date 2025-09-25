import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Goal {
  id: string;
  text: string;
  date: string;
  color: string;
}

interface GoalTrackerProps {
  goals: Goal[];
  onGoalAdd: (goal: Omit<Goal, 'id'>) => void;
  onGoalRemove: (id: string) => void;
  selectedDate?: string;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ 
  goals, 
  onGoalAdd, 
  onGoalRemove, 
  selectedDate 
}) => {
  const [newGoal, setNewGoal] = useState('');
  const [goalDate, setGoalDate] = useState(selectedDate || '');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const colors = [
    '#FF1493', '#00FF7F', '#1E90FF', '#FF4500', '#32CD32', '#FF69B4', '#00CED1', '#FF6347', '#00FFFF', '#DA70D6', '#FFFF00', '#7FFF00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim() && goalDate) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      onGoalAdd({
        text: newGoal.trim(),
        date: goalDate,
        color: randomColor,
      });
      setNewGoal('');
      setGoalDate('');
      setIsAddingGoal(false);
    }
  };

  React.useEffect(() => {
    if (selectedDate) {
      setGoalDate(selectedDate);
      setIsAddingGoal(true);
    }
  }, [selectedDate]);

  return (
    <div className="p-3 sm:p-4 h-full flex flex-col min-h-0">
      <div className="flex-shrink-0 mb-3 flex flex-row justify-between">
        <div className="text-white text-sm font-medium mb-1">Goals</div>
        <div className="text-gray-400 text-xs">
          Track your important dates and milestones
        </div>
      </div>

      <div className="flex-1 space-y-2 mb-3 min-h-0 overflow-y-auto">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-2 bg-[#1F2123] rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: goal.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm truncate">{goal.text}</div>
                <div className="text-white text-xs">
                  {new Date(goal.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => onGoalRemove(goal.id)}
              className="text-white hover:text-red-400 transition-colors flex-shrink-0"
              aria-label={`Delete goal: ${goal.text}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0">
        {isAddingGoal ? (
          <form onSubmit={handleSubmit} className="space-y-2" aria-label="Add new goal">
            <label htmlFor="goal-input" className="sr-only">Goal description</label>
            <input
              id="goal-input"
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter goal..."
              aria-describedby="goal-help"
              className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm placeholder-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <label htmlFor="goal-date" className="sr-only">Goal target date</label>
            <input
              id="goal-date"
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              aria-describedby="date-help"
              className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-sm rounded transition-colors"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingGoal(true)}
            className="flex items-center space-x-2 w-full p-2 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
          >
            <Plus size={16} className="text-rose-500" />
            <span className="text-white text-sm">Add new goal</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;