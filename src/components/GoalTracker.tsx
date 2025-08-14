import React, { useState, useRef, useEffect } from 'react';
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
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#FF1493', '#00FF7F', '#1E90FF', '#FF4500', '#32CD32', '#FF69B4', 
    '#00CED1', '#FF6347', '#00FFFF', '#DA70D6', '#FFFF00', '#7FFF00'
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
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setNewGoal('');
    setGoalDate(selectedDate || '');
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (selectedDate) {
      setGoalDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="p-4 h-full relative">
      <div className="mb-4">
        <div className="text-white text-sm font-medium mb-2">Goals</div>
        <div className="text-gray-400 text-xs">
          Track your important dates and milestones
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-20 overflow-y-auto">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-2 bg-[#1F2123] rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: goal.color }}
              />
              <div className="min-w-0">
                <div className="text-white text-sm truncate">{goal.text}</div>
                <div className="text-gray-400 text-xs">
                  {new Date(goal.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => onGoalRemove(goal.id)}
              className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 w-full p-2 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
      >
        <Plus size={16} className="text-rose-500" />
        <span className="text-white text-sm">Add new goal</span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute bottom-10 mb-2 w-100 bg-[#2A2D30] border border-gray-600 rounded-lg shadow-lg p-4 z-50 "
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter goal..."
              className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-rose-500"
              autoFocus
            />
            <input
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!newGoal.trim() || !goalDate}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;