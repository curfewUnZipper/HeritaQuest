'use client';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { loadQuiz } from '../../store/quizSlice';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface GameSelectMenuProps {
  onClose: () => void;
  locationName: string;
  coordinates: [number, number] | null | undefined;
}

const themes = [
  'Language',
  'History',
  'Games and Festivals',
  'Food',
];

export default function GameSelectMenu({ onClose, locationName, coordinates }: GameSelectMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'gameSelection' | 'themeSelection'>('gameSelection');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Clear error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Check if user is signed in by looking in localStorage for "user"
  const isUserSignedIn = () => {
    try {
      const user = localStorage.getItem('user');
      return user !== null;
    } catch {
      return false;
    }
  };

  // When user clicks a game, move to theme selection or show error if no location selected
  const handleGameClick = (game: string) => {
    if (!coordinates) {
      setErrorMessage('Please select a location to start the Game');
      return;
    }
    setSelectedGame(game);
    setStep('themeSelection');
    setErrorMessage(null);
  };

  // After theme selection, load the quiz (or other game logic)
  const handleThemeConfirm = () => {
    if (!coordinates || !selectedGame || !selectedTheme) return;

    if (!isUserSignedIn()) {
      setErrorMessage('Sign In to Play');
      return;
    }

    setLoading(true);

    const formattedLocation = `${locationName}  Lat: ${coordinates[0].toFixed(4)}, Lng: ${coordinates[1].toFixed(4)} Theme: ${selectedTheme}`;

    if (selectedGame === 'Quiz') {
      dispatch(loadQuiz({ location: formattedLocation }))
        .unwrap()
        .then(() => {
          setLoading(false);
          onClose();
          router.push('/quiz');
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (selectedGame === 'Fill In The Blanks') {
      console.log(`Pushing /fillinblanks?topic=${encodeURIComponent(formattedLocation)}`);
    router.push(`/fillinblanks?topic=${encodeURIComponent(formattedLocation)}`);
} else {
      onClose();
    }
  };

  const handleBack = () => {
    setStep('gameSelection');
    setSelectedGame(null);
    setSelectedTheme(null);
    setErrorMessage(null);
  };

  return (
    <div className="lg:w-[40vw] md:w-[40vw] sm:w-[50vw] h-[40vh] backdrop-blur-md bg-white/30 shadow-xl rounded-lg p-6 relative z-[9999] overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-md text-white rounded-full px-3 py-1 bg-red-600 hover:bg-red-800"
        onClick={onClose}
      >
        x
      </button>

      {step === 'gameSelection' && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select a Game:</h2>
          <div className="space-y-4">
              <button
                onClick={() => {
                  if (!coordinates) {
                    setErrorMessage('Please select a location to start the Game');
                    return;
                  }
                  handleGameClick('Quiz');
                }}
                className={`w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 ${
                  !coordinates ? 'opacity-50 cursor-not-allowed hover:bg-green-600' : ''
                }`}
              >
                Quiz
              </button>

              <button
                onClick={() => {
                  if (!coordinates) {
                    setErrorMessage('Please select a location to start the Game');
                    return;
                  }
                  handleGameClick('Fill In The Blanks');
                }}
                className={`w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 ${
                  !coordinates ? 'opacity-50 cursor-not-allowed hover:bg-green-600' : ''
                }`}
              >
                Fill In The Blanks
              </button>
            </div>
          {errorMessage && (
            <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
          )}
        </>
      )}

      {step === 'themeSelection' && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select a Theme:</h2>
          <div className="flex flex-col  space-y-4 mb-6">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`py-3 px-4 rounded border ${
                  selectedTheme === theme
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-400 bg-green-600 hover:bg-green-700"
            >
              Back
            </button>
            <button
              onClick={handleThemeConfirm}
              disabled={!selectedTheme || loading}
              className="px-4 py-2 mx-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Start'}
            </button>
          </div>
          {errorMessage && (
            <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
}
