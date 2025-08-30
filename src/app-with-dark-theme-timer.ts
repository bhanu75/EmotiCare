import React, { useState, useEffect } from 'react';
import { Heart, Sun, Clock, CheckCircle, Star, Coffee, Book, Music, Smile, LucideIcon, Moon, Play, Pause, Square, RotateCcw, Timer } from 'lucide-react';

// Configuration object - controls all features
const appConfig = {
  features: {
    showTimer: true,           // Timer during practices
    showProgress: true,        // Progress bar for routine
    showCategories: true,      // Category filter buttons
    showDifficulty: false,     // Difficulty levels for practices
    enableStreaks: false,      // Track daily streaks
    showMoodTracker: true,     // Mood selection before routine
    enableSounds: false,       // Sound notifications
    showWeather: false,        // Weather-based recommendations
    darkTheme: true,           // Dark theme toggle
  },
  limits: {
    maxRoutineTime: 45,        // Max routine duration
    minPractices: 1,           // Min practices required
    maxPractices: 8,           // Max practices allowed
  },
  ui: {
    theme: 'wellness',         // UI theme
    showTips: true,            // Show pro tips section
    compactMode: false,        // Compact UI layout
  }
};

// Type definitions
interface Practice {
  id: string;
  name: string;
  duration: number;
  category: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface SampleRoutine {
  name: string;
  practices: string[];
}

interface TimerState {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
  activePractice: string | null;
}

// Data layer - separated from UI logic
const practicesData: Practice[] = [
  {
    id: 'gratitude',
    name: 'Gratitude Journaling',
    duration: 5,
    category: 'mindfulness',
    description: 'Write down 3 things you\'re grateful for',
    icon: Heart,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
  },
  {
    id: 'affirmations',
    name: 'Positive Affirmations',
    duration: 3,
    category: 'mindfulness',
    description: 'Repeat empowering statements to yourself',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
  },
  {
    id: 'breathing',
    name: 'Deep Breathing',
    duration: 7,
    category: 'mindfulness',
    description: '4-7-8 breathing technique for calm',
    icon: Sun,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
  },
  {
    id: 'meditation',
    name: 'Mini Meditation',
    duration: 10,
    category: 'mindfulness',
    description: 'Guided or silent meditation',
    icon: Sun,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  },
  {
    id: 'intentions',
    name: 'Set Daily Intentions',
    duration: 5,
    category: 'planning',
    description: 'Choose your emotional focus for the day',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
  },
  {
    id: 'music',
    name: 'Uplifting Music',
    duration: 5,
    category: 'joy',
    description: 'Listen to songs that boost your mood',
    icon: Music,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
  },
  {
    id: 'reading',
    name: 'Inspirational Reading',
    duration: 8,
    category: 'growth',
    description: 'Read poetry, quotes, or uplifting passages',
    icon: Book,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
  },
  {
    id: 'tea',
    name: 'Mindful Tea/Coffee',
    duration: 10,
    category: 'mindfulness',
    description: 'Savor your morning beverage mindfully',
    icon: Coffee,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
  },
  {
    id: 'gentle-movement',
    name: 'Gentle Stretching',
    duration: 10,
    category: 'physical',
    description: 'Simple stretches to connect with your body',
    icon: Smile,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300'
  }
];

const sampleRoutinesData: SampleRoutine[] = [
  {
    name: 'Quick Start (15 min)',
    practices: ['gratitude', 'affirmations', 'breathing']
  },
  {
    name: 'Mindful Morning (25 min)',
    practices: ['tea', 'meditation', 'intentions']
  },
  {
    name: 'Energizing Boost (20 min)',
    practices: ['music', 'gentle-movement', 'affirmations']
  }
];

// Categories for filtering (only used if showCategories = true)
const categories = [
  { id: 'all', name: '🌟 All Practices', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'mindfulness', name: '🧘 Mindfulness', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'physical', name: '💪 Physical', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'planning', name: '📋 Planning', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'joy', name: '😊 Joy', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'growth', name: '📚 Growth', color: 'bg-indigo-100 dark:bg-indigo-900' }
];

// Mood options (only used if showMoodTracker = true)
const moodOptions = [
  { id: 'energetic', name: '⚡ Energetic', practices: ['music', 'gentle-movement', 'affirmations'] },
  { id: 'calm', name: '😌 Need Calm', practices: ['breathing', 'meditation', 'tea'] },
  { id: 'motivated', name: '🎯 Need Motivation', practices: ['affirmations', 'music', 'intentions'] },
  { id: 'stressed', name: '😰 Stressed', practices: ['breathing', 'gratitude', 'tea'] },
  { id: 'tired', name: '😴 Tired', practices: ['tea', 'gentle-movement', 'music'] }
];

// Custom hooks for state management
const useRoutineBuilder = () => {
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<Practice[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [routineProgress, setRoutineProgress] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Timer state
  const [timer, setTimer] = useState<TimerState>({
    timeLeft: 0,
    totalTime: 0,
    isRunning: false,
    isPaused: false,
    activePractice: null
  });

  // Timer functions
  const startTimer = (practiceId: string, duration: number) => {
    const timeInSeconds = duration * 60;
    setTimer({
      timeLeft: timeInSeconds,
      totalTime: timeInSeconds,
      isRunning: true,
      isPaused: false,
      activePractice: practiceId
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false, isPaused: true }));
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const stopTimer = () => {
    setTimer({
      timeLeft: 0,
      totalTime: 0,
      isRunning: false,
      isPaused: false,
      activePractice: null
    });
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      timeLeft: prev.totalTime,
      isRunning: false,
      isPaused: false
    }));
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            if (prev.activePractice) {
              markCompleted(prev.activePractice);
            }
            return {
              timeLeft: 0,
              totalTime: 0,
              isRunning: false,
              isPaused: false,
              activePractice: null
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.timeLeft]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const loadMoodRoutine = (moodId: string) => {
    const mood = moodOptions.find(m => m.id === moodId);
    if (mood) {
      setSelectedPractices(mood.practices);
      setCurrentMood(moodId);
    }
  };

  const updateProgress = () => {
    if (currentRoutine.length === 0) return;
    const completed = currentRoutine.filter(p => completedToday.has(p.id)).length;
    setRoutineProgress(Math.round((completed / currentRoutine.length) * 100));
  };

  const togglePractice = (practice: Practice) => {
    const isSelected = selectedPractices.includes(practice.id);
    if (isSelected) {
      setSelectedPractices(prev => prev.filter(id => id !== practice.id));
    } else {
      setSelectedPractices(prev => [...prev, practice.id]);
    }
  };

  const buildRoutine = () => {
    const selected = practicesData.filter(p => selectedPractices.includes(p.id));
    const total = selected.reduce((sum, p) => sum + p.duration, 0);
    setCurrentRoutine(selected);
    setTotalTime(total);
  };

  const markCompleted = (practiceId: string) => {
    setCompletedToday(prev => new Set([...prev, practiceId]));
  };

  const loadSampleRoutine = (routine: SampleRoutine) => {
    setSelectedPractices(routine.practices);
  };

  return {
    selectedPractices,
    currentRoutine,
    totalTime,
    completedToday,
    togglePractice,
    buildRoutine,
    markCompleted,
    loadSampleRoutine,
    selectedCategory,
    setSelectedCategory,
    currentMood,
    loadMoodRoutine,
    routineProgress,
    updateProgress,
    isDarkMode,
    toggleDarkMode,
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer
  };
};

// Utility functions
const getTimeColor = (totalTime: number): string => {
  if (totalTime <= 30) return 'text-green-600 dark:text-green-400';
  if (totalTime <= 35) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Dark Mode Toggle Component
interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  if (!appConfig.features.darkTheme) return null;

  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

// Timer Display Component
interface TimerDisplayProps {
  timer: TimerState;
  onStart: (practiceId: string, duration: number) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  currentRoutine: Practice[];
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timer, 
  onStart, 
  onPause, 
  onResume, 
  onStop, 
  onReset,
  currentRoutine 
}) => {
  if (!appConfig.features.showTimer) return null;

  const activePractice = currentRoutine.find(p => p.id === timer.activePractice);
  const progressPercentage = timer.totalTime > 0 
    ? Math.round(((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100)
    : 0;

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[250px]">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Practice Timer</h3>
      </div>
      
      {timer.activePractice && activePractice ? (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {formatTime(timer.timeLeft)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {activePractice.name}
            </div>
          </div>
          
          {/* Progress circle */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2"
                  fill="transparent"
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                />
                <path
                  className="stroke-blue-600 dark:stroke-blue-400"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${progressPercentage}, 100`}
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                {progressPercentage}%
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            {timer.isRunning ? (
              <button
                onClick={onPause}
                className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={timer.isPaused ? onResume : onReset}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title={timer.isPaused ? "Resume" : "Start"}
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={onStop}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
            
            <button
              onClick={onReset}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Select a practice to start timer
        </div>
      )}
    </div>
  );
};

// Header Component
const Header: React.FC = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Sun className="w-8 h-8 text-yellow-500" />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Morning Emotional Care</h1>
    </div>
    <p className="text-gray-600 dark:text-gray-300">Build your personalized 30-minute morning routine for emotional wellbeing</p>
  </div>
);

// Sample Routines Component
interface SampleRoutinesProps {
  onLoadRoutine: (routine: SampleRoutine) => void;
}

const SampleRoutines: React.FC<SampleRoutinesProps> = ({ onLoadRoutine }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Quick Start Options</h2>
    <div className="grid md:grid-cols-3 gap-4">
      {sampleRoutinesData.map((routine, index) => (
        <button
          key={index}
          onClick={() => onLoadRoutine(routine)}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-medium text-gray-800 dark:text-gray-100">{routine.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {routine.practices.map(id => practicesData.find(p => p.id === id)?.name).join(', ')}
          </p>
        </button>
      ))}
    </div>
  </div>
);

// Category Filter Component (only shows if config enabled)
interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  if (!appConfig.features.showCategories) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : `${category.color} text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900`
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// Mood Tracker Component (only shows if config enabled)
interface MoodTrackerProps {
  currentMood: string;
  onMoodSelect: (moodId: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ currentMood, onMoodSelect }) => {
  if (!appConfig.features.showMoodTracker) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 rounded-lg border border-pink-200 dark:border-pink-700">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">How are you feeling today?</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors text-center ${
              currentMood === mood.id
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {mood.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// Progress Bar Component (only shows if config enabled)
interface ProgressBarProps {
  progress: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
  if (!appConfig.features.showProgress || total === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>Progress</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Practice Card Component
interface PracticeCardProps {
  practice: Practice;
  isSelected: boolean;
  onToggle: (practice: Practice) => void;
  onStartTimer: (practiceId: string, duration: number) => void;
  isTimerActive: boolean;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ practice, isSelected, onToggle, onStartTimer, isTimerActive }) => {
  const Icon = practice.icon;
  
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div onClick={() => onToggle(practice)} className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full ${practice.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 dark:text-gray-100">{practice.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            {practice.duration} min
          </div>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{practice.description}</p>
      
      {/* Timer Button */}
      {appConfig.features.showTimer && isSelected && (
        <button
          onClick={() => onStartTimer(practice.id, practice.duration)}
          disabled={isTimerActive}
          className={`w-full px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
            isTimerActive
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
          }`}
        >
          {isTimerActive ? 'Timer Running' : `Start ${practice.duration}min Timer`}
        </button>
      )}
    </div>
  );
};

// Practice Selection Component (Updated to use filtered practices)
interface PracticeSelectionProps {
  selectedPractices: string[];
  onTogglePractice: (practice: Practice) => void;
  practices?: Practice[];
  onStartTimer: (practiceId: string, duration: number) => void;
  isTimerActive: boolean;
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({ 
  selectedPractices, 
  onTogglePractice, 
  practices = practicesData,
  onStartTimer,
  isTimerActive
}) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Choose Your Practices</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {practices.map((practice) => (
        <PracticeCard
          key={practice.id}
          practice={practice}
          isSelected={selectedPractices.includes(practice.id)}
          onToggle={onTogglePractice}
          onStartTimer={onStartTimer}
          isTimerActive={isTimerActive}
        />
      ))}
    </div>
  </div>
);

// Build Button Component
interface BuildButtonProps {
  selectedPractices: string[];
  onBuild: () => void;
}

const BuildButton: React.FC<BuildButtonProps> = ({ selectedPractices, onBuild }) => {
  if (selectedPractices.length === 0) return null;
  
  return (
    <div className="text-center mb-8">
      <button
        onClick={onBuild}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Build My Routine ({selectedPractices.length} practices)
      </button>
    </div>
  );
};

// Routine Item Component
interface RoutineItemProps {
  practice: Practice;
  index: number;
  isCompleted: boolean;
  onMarkCompleted: (practiceId: string) => void;
  onStartTimer: (practiceId: string, duration: number) => void;
  isTimerActive: boolean;
}

const RoutineItem: React.FC<RoutineItemProps> = ({ practice, index, isCompleted, onMarkCompleted, onStartTimer, isTimerActive }) => {
  const Icon = practice.icon;
  
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border ${
        isCompleted ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="text-gray-500 dark:text-gray-400 font-medium w-6 text-center">
        {index + 1}.
      </div>
      <div className={`p-2 rounded-full ${practice.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-gray-200'}`}>
          {practice.name}
        </h3>
        <p className={`text-sm ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {practice.description}
        </p>
      </div>
      <div className={`text-sm font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {practice.duration} min
      </div>
      
      {/* Timer Button for Routine Items */}
      {appConfig.features.showTimer && (
        <button
          onClick={() => onStartTimer(practice.id, practice.duration)}
          disabled={isTimerActive || isCompleted}
          className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors mr-2 ${
            isTimerActive || isCompleted
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
          }`}
        >
          ⏱️
        </button>
      )}
      
      <button
        onClick={() => onMarkCompleted(practice.id)}
        disabled={isCompleted}
        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
          isCompleted
            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 cursor-not-allowed'
            : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
        }`}
      >
        {isCompleted ? 'Done' : 'Complete'}
      </button>
    </div>
  );
};

// Instructions Component
const Instructions: React.FC = () => (
  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How to Use This Toolkit:</h3>
    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
      <p><strong>Step 1:</strong> Either click a "Quick Start" routine or manually select practices that appeal to you</p>
      <p><strong>Step 2:</strong> Click "Build My Routine" to see your personalized schedule</p>
      <p><strong>Step 3:</strong> Follow the numbered order, clicking "Complete" after each practice</p>
      <p><strong>Step 4:</strong> Use the timer feature to track your practice time</p>
      <p><strong>Step 5:</strong> Adjust practices based on what works for your mood and energy</p>
    </div>
  </div>
);

// Example Routines Component
const ExampleRoutines: React.FC = () => (
  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
    <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">5 Example Routines for Different Needs:</h3>
    <div className="space-y-3 text-sm text-green-700 dark:text-green-300">
      <div className="border-l-4 border-green-300 dark:border-green-600 pl-3">
        <p><strong>Anxious Morning (20 min):</strong> Deep Breathing (7 min) → Positive Affirmations (3 min) → Mindful Tea/Coffee (10 min)</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">Perfect when you wake up feeling worried or overwhelmed</p>
      </div>
      
      <div className="border-l-4 border-green-300 dark:border-green-600 pl-3">
        <p><strong>Low Energy Day (18 min):</strong> Gratitude Journaling (5 min) → Uplifting Music (5 min) → Gentle Stretching (8 min)</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">Great for days when you feel unmotivated or down</p>
      </div>
      
      <div className="border-l-4 border-green-300 dark:border-green-600 pl-3">
        <p><strong>Busy Schedule (13 min):</strong> Positive Affirmations (3 min) → Set Daily Intentions (5 min) → Uplifting Music (5 min)</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">Quick routine when you're pressed for time but need emotional grounding</p>
      </div>
      
      <div className="border-l-4 border-green-300 dark:border-green-600 pl-3">
        <p><strong>Deep Reset (30 min):</strong> Gratitude Journaling (5 min) → Mini Meditation (10 min) → Mindful Tea/Coffee (10 min) → Set Daily Intentions (5 min)</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">For weekends or when you have your full 30 minutes available</p>
      </div>
      
      <div className="border-l-4 border-green-300 dark:border-green-600 pl-3">
        <p><strong>Creative Inspiration (23 min):</strong> Inspirational Reading (8 min) → Uplifting Music (5 min) → Mini Meditation (10 min)</p>
        <p className="text-xs mt-1 text-green-600 dark:text-green-400">When you need to spark creativity and positive thinking for the day</p>
      </div>
    </div>
  </div>
);

// Pro Tips Component
const ProTips: React.FC = () => (
  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
    <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Pro Tips:</h3>
    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
      <li>• <strong>Week 1-2:</strong> Start with just one 15-minute routine to build the habit</li>
      <li>• <strong>Match your mood:</strong> Feeling anxious? Focus on breathing. Feeling low? Try music + movement</li>
      <li>• <strong>Use the timer:</strong> Set timers for each practice to stay focused and track progress</li>
      <li>• <strong>Prepare the night before:</strong> Set out your journal, prepare your tea, queue up your playlist</li>
      <li>• <strong>Track what works:</strong> Notice which practices leave you feeling most centered</li>
      <li>• <strong>Be flexible:</strong> Some days you might only have 10 minutes - that's still valuable!</li>
      <li>• <strong>Dark mode:</strong> Toggle between light and dark themes for comfortable viewing</li>
    </ul>
  </div>
);

// Current Routine Display Component
interface CurrentRoutineDisplayProps {
  currentRoutine: Practice[];
  totalTime: number;
  completedToday: Set<string>;
  onMarkCompleted: (practiceId: string) => void;
  onStartTimer: (practiceId: string, duration: number) => void;
  isTimerActive: boolean;
}

const CurrentRoutineDisplay: React.FC<CurrentRoutineDisplayProps> = ({ 
  currentRoutine, 
  totalTime, 
  completedToday, 
  onMarkCompleted, 
  onStartTimer, 
  isTimerActive 
}) => {
  if (currentRoutine.length === 0) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Morning Routine</h2>
        <div className={`text-lg font-medium ${getTimeColor(totalTime)}`}>
          Total: {totalTime} minutes
        </div>
      </div>
      
      {totalTime > appConfig.limits.maxRoutineTime && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Your routine is {totalTime - appConfig.limits.maxRoutineTime} minutes over your {appConfig.limits.maxRoutineTime}-minute goal. Consider removing a practice or choosing shorter ones.
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {currentRoutine.map((practice, index) => (
          <RoutineItem
            key={practice.id}
            practice={practice}
            index={index}
            isCompleted={completedToday.has(practice.id)}
            onMarkCompleted={onMarkCompleted}
            onStartTimer={onStartTimer}
            isTimerActive={isTimerActive}
          />
        ))}
      </div>
      
      <Instructions />
      <ExampleRoutines />
      <ProTips />
    </div>
  );
};

// Main Component
const MorningEmotionalCare: React.FC = () => {
  const {
    selectedPractices,
    currentRoutine,
    totalTime,
    completedToday,
    togglePractice,
    buildRoutine,
    markCompleted,
    loadSampleRoutine,
    selectedCategory,
    setSelectedCategory,
    currentMood,
    loadMoodRoutine,
    routineProgress,
    updateProgress,
    isDarkMode,
    toggleDarkMode,
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer
  } = useRoutineBuilder();

  // Filter practices based on selected category
  const displayedPractices = selectedCategory === 'all' 
    ? practicesData 
    : practicesData.filter(p => p.category === selectedCategory);

  // Update progress when completed practices change
  useEffect(() => {
    updateProgress();
  }, [completedToday, updateProgress]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      
      {/* Timer Display */}
      <TimerDisplay
        timer={timer}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onStop={stopTimer}
        onReset={resetTimer}
        currentRoutine={currentRoutine}
      />
      
      <Header />
      
      {/* NEW FEATURES - Only show if enabled in config */}
      <MoodTracker currentMood={currentMood} onMoodSelect={loadMoodRoutine} />
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <ProgressBar progress={routineProgress} total={currentRoutine.length} />
      
      <SampleRoutines onLoadRoutine={loadSampleRoutine} />
      
      <PracticeSelection 
        selectedPractices={selectedPractices}
        onTogglePractice={togglePractice}
        practices={displayedPractices}
        onStartTimer={startTimer}
        isTimerActive={timer.isRunning}
      />
      
      <BuildButton 
        selectedPractices={selectedPractices}
        onBuild={buildRoutine}
      />
      
      <CurrentRoutineDisplay
        currentRoutine={currentRoutine}
        totalTime={totalTime}
        completedToday={completedToday}
        onMarkCompleted={markCompleted}
        onStartTimer={startTimer}
        isTimerActive={timer.isRunning}
      />
    </div>
  );
};

export default MorningEmotionalCare;