import React, { useState, useEffect } from 'react';
import { Heart, Sun, Clock, CheckCircle, Star, Coffee, Book, Music, Smile, LucideIcon } from 'lucide-react';

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

// Data layer - separated from UI logic
const practicesData: Practice[] = [
  {
    id: 'gratitude',
    name: 'Gratitude Journaling',
    duration: 5,
    category: 'mindfulness',
    description: 'Write down 3 things you\'re grateful for',
    icon: Heart,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: 'affirmations',
    name: 'Positive Affirmations',
    duration: 3,
    category: 'mindfulness',
    description: 'Repeat empowering statements to yourself',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 'breathing',
    name: 'Deep Breathing',
    duration: 7,
    category: 'mindfulness',
    description: '4-7-8 breathing technique for calm',
    icon: Sun,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'meditation',
    name: 'Mini Meditation',
    duration: 10,
    category: 'mindfulness',
    description: 'Guided or silent meditation',
    icon: Sun,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'intentions',
    name: 'Set Daily Intentions',
    duration: 5,
    category: 'planning',
    description: 'Choose your emotional focus for the day',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'music',
    name: 'Uplifting Music',
    duration: 5,
    category: 'joy',
    description: 'Listen to songs that boost your mood',
    icon: Music,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'reading',
    name: 'Inspirational Reading',
    duration: 8,
    category: 'growth',
    description: 'Read poetry, quotes, or uplifting passages',
    icon: Book,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'tea',
    name: 'Mindful Tea/Coffee',
    duration: 10,
    category: 'mindfulness',
    description: 'Savor your morning beverage mindfully',
    icon: Coffee,
    color: 'bg-amber-100 text-amber-600'
  },
  {
    id: 'gentle-movement',
    name: 'Gentle Stretching',
    duration: 10,
    category: 'physical',
    description: 'Simple stretches to connect with your body',
    icon: Smile,
    color: 'bg-teal-100 text-teal-600'
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
  { id: 'all', name: '🌟 All Practices', color: 'bg-gray-100' },
  { id: 'mindfulness', name: '🧘 Mindfulness', color: 'bg-purple-100' },
  { id: 'physical', name: '💪 Physical', color: 'bg-green-100' },
  { id: 'planning', name: '📋 Planning', color: 'bg-blue-100' },
  { id: 'joy', name: '😊 Joy', color: 'bg-yellow-100' },
  { id: 'growth', name: '📚 Growth', color: 'bg-indigo-100' }
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
    updateProgress
  };
};

// Utility functions
const getTimeColor = (totalTime: number): string => {
  if (totalTime <= 30) return 'text-green-600';
  if (totalTime <= 35) return 'text-yellow-600';
  return 'text-red-600';
};

// Header Component
const Header: React.FC = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Sun className="w-8 h-8 text-yellow-500" />
      <h1 className="text-3xl font-bold text-gray-800">Morning Emotional Care</h1>
    </div>
    <p className="text-gray-600">Build your personalized 30-minute morning routine for emotional wellbeing</p>
  </div>
);

// Sample Routines Component
interface SampleRoutinesProps {
  onLoadRoutine: (routine: SampleRoutine) => void;
}

const SampleRoutines: React.FC<SampleRoutinesProps> = ({ onLoadRoutine }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Start Options</h2>
    <div className="grid md:grid-cols-3 gap-4">
      {sampleRoutinesData.map((routine, index) => (
        <button
          key={index}
          onClick={() => onLoadRoutine(routine)}
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-gray-800">{routine.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
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
      <h3 className="text-lg font-medium mb-3 text-gray-700">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : `${category.color} text-gray-700 hover:bg-blue-100`
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
    <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
      <h3 className="text-lg font-medium mb-3 text-gray-800">How are you feeling today?</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors text-center ${
              currentMood === mood.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-100'
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
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
}

const PracticeCard: React.FC<PracticeCardProps> = ({ practice, isSelected, onToggle }) => {
  const Icon = practice.icon;
  
  return (
    <div
      onClick={() => onToggle(practice)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full ${practice.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{practice.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {practice.duration} min
          </div>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
      </div>
      <p className="text-sm text-gray-600">{practice.description}</p>
    </div>
  );
};

// Practice Selection Component (Updated to use filtered practices)
interface PracticeSelectionProps {
  selectedPractices: string[];
  onTogglePractice: (practice: Practice) => void;
  practices?: Practice[];
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({ 
  selectedPractices, 
  onTogglePractice, 
  practices = practicesData 
}) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Choose Your Practices</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {practices.map((practice) => (
        <PracticeCard
          key={practice.id}
          practice={practice}
          isSelected={selectedPractices.includes(practice.id)}
          onToggle={onTogglePractice}
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
}

const RoutineItem: React.FC<RoutineItemProps> = ({ practice, index, isCompleted, onMarkCompleted }) => {
  const Icon = practice.icon;
  
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="text-gray-500 font-medium w-6 text-center">
        {index + 1}.
      </div>
      <div className={`p-2 rounded-full ${practice.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
          {practice.name}
        </h3>
        <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
          {practice.description}
        </p>
      </div>
      <div className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
        {practice.duration} min
      </div>
      <button
        onClick={() => onMarkCompleted(practice.id)}
        disabled={isCompleted}
        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
          isCompleted
            ? 'bg-green-200 text-green-800 cursor-not-allowed'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
      >
        {isCompleted ? 'Done' : 'Complete'}
      </button>
    </div>
  );
};

// Instructions Component
const Instructions: React.FC = () => (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
    <h3 className="font-medium text-blue-800 mb-2">How to Use This Toolkit:</h3>
    <div className="text-sm text-blue-700 space-y-2">
      <p><strong>Step 1:</strong> Either click a "Quick Start" routine or manually select practices that appeal to you</p>
      <p><strong>Step 2:</strong> Click "Build My Routine" to see your personalized schedule</p>
      <p><strong>Step 3:</strong> Follow the numbered order, clicking "Complete" after each practice</p>
      <p><strong>Step 4:</strong> Adjust practices based on what works for your mood and energy</p>
    </div>
  </div>
);

// Example Routines Component
const ExampleRoutines: React.FC = () => (
  <div className="mt-4 p-4 bg-green-50 rounded-lg">
    <h3 className="font-medium text-green-800 mb-3">5 Example Routines for Different Needs:</h3>
    <div className="space-y-3 text-sm text-green-700">
      <div className="border-l-3 border-green-300 pl-3">
        <p><strong>Anxious Morning (20 min):</strong> Deep Breathing (7 min) → Positive Affirmations (3 min) → Mindful Tea/Coffee (10 min)</p>
        <p className="text-xs mt-1">Perfect when you wake up feeling worried or overwhelmed</p>
      </div>
      
      <div className="border-l-3 border-green-300 pl-3">
        <p><strong>Low Energy Day (18 min):</strong> Gratitude Journaling (5 min) → Uplifting Music (5 min) → Gentle Stretching (8 min)</p>
        <p className="text-xs mt-1">Great for days when you feel unmotivated or down</p>
      </div>
      
      <div className="border-l-3 border-green-300 pl-3">
        <p><strong>Busy Schedule (13 min):</strong> Positive Affirmations (3 min) → Set Daily Intentions (5 min) → Uplifting Music (5 min)</p>
        <p className="text-xs mt-1">Quick routine when you're pressed for time but need emotional grounding</p>
      </div>
      
      <div className="border-l-3 border-green-300 pl-3">
        <p><strong>Deep Reset (30 min):</strong> Gratitude Journaling (5 min) → Mini Meditation (10 min) → Mindful Tea/Coffee (10 min) → Set Daily Intentions (5 min)</p>
        <p className="text-xs mt-1">For weekends or when you have your full 30 minutes available</p>
      </div>
      
      <div className="border-l-3 border-green-300 pl-3">
        <p><strong>Creative Inspiration (23 min):</strong> Inspirational Reading (8 min) → Uplifting Music (5 min) → Mini Meditation (10 min)</p>
        <p className="text-xs mt-1">When you need to spark creativity and positive thinking for the day</p>
      </div>
    </div>
  </div>
);

// Pro Tips Component
const ProTips: React.FC = () => (
  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
    <h3 className="font-medium text-yellow-800 mb-2">Pro Tips:</h3>
    <ul className="text-sm text-yellow-700 space-y-1">
      <li>• <strong>Week 1-2:</strong> Start with just one 15-minute routine to build the habit</li>
      <li>• <strong>Match your mood:</strong> Feeling anxious? Focus on breathing. Feeling low? Try music + movement</li>
      <li>• <strong>Prepare the night before:</strong> Set out your journal, prepare your tea, queue up your playlist</li>
      <li>• <strong>Track what works:</strong> Notice which practices leave you feeling most centered</li>
      <li>• <strong>Be flexible:</strong> Some days you might only have 10 minutes - that's still valuable!</li>
    </ul>
  </div>
);


// Current Routine Display Component
interface CurrentRoutineDisplayProps {
  currentRoutine: Practice[];
  totalTime: number;
  completedToday: Set<string>;
  onMarkCompleted: (practiceId: string) => void;
}

const CurrentRoutineDisplay: React.FC<CurrentRoutineDisplayProps> = ({ currentRoutine, totalTime, completedToday, onMarkCompleted }) => {
  if (currentRoutine.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Morning Routine</h2>
        <div className={`text-lg font-medium ${getTimeColor(totalTime)}`}>
          Total: {totalTime} minutes
        </div>
      </div>
      
      {totalTime > 30 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            Your routine is {totalTime - 30} minutes over your 30-minute goal. Consider removing a practice or choosing shorter ones.
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
    updateProgress
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
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
      />
    </div>
  );
};

export default MorningEmotionalCare;
