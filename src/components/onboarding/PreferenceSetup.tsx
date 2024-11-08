// src/components/onboarding/PreferencesSetup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PreferencesStep {
  id: string;
  title: string;
  question: string;
  options: string[];
}

const ONBOARDING_STEPS: PreferencesStep[] = [
  {
    id: 'genres',
    title: 'Movie Genres',
    question: 'What types of movies do you enjoy watching?',
    options: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary']
  },
  {
    id: 'decades',
    title: 'Time Periods',
    question: 'Which movie eras interest you the most?',
    options: ['2020s', '2010s', '2000s', '90s', '80s', 'Classic']
  },
  {
    id: 'ratings',
    title: 'Content Ratings',
    question: 'What content ratings are you comfortable with?',
    options: ['G', 'PG', 'PG-13', 'R', 'NC-17']
  }
];

export function PreferencesSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Record<string, string[]>>({});
  const { updateProfile, user } = useAuth();
  const navigate = useNavigate();

  const handleSelection = (option: string) => {
    const stepId = ONBOARDING_STEPS[currentStep].id;
    setPreferences(prev => ({
      ...prev,
      [stepId]: [...(prev[stepId] || []), option]
    }));
  };

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save preferences and redirect to home
      try {
        await updateProfile({
          preferences: preferences
        });
        navigate('/home');
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-kemo-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 bg-kemo-dark/50 p-8 rounded-2xl backdrop-blur-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-gold">
            {currentStepData.title}
          </h2>
          <p className="mt-2 text-gray-400">
            {currentStepData.question}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          {currentStepData.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelection(option)}
              className={`p-4 rounded-lg transition-all duration-200
                ${preferences[currentStepData.id]?.includes(option)
                  ? 'bg-brand-gold text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-white/60 hover:text-white"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="ml-auto px-6 py-2 bg-brand-gold hover:bg-brand-darker
              text-black rounded-lg transition-all duration-200"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>

        <div className="flex justify-center mt-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1
                ${index === currentStep ? 'bg-brand-gold' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}