"use client";

import { usePrivy } from '@privy-io/react-auth';

interface Challenge {
  id: number;
  title: string;
  type: string;
  description: string;
}

export default function Home() {
  const { login, logout, authenticated, user, ready } = usePrivy(); // Added 'ready'
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Fitness Surge", // More engaging title
      type: "Fitness",
      description: "Commit to daily push-ups, squats, and a 30-minute run. Track your progress and feel the burn!",
    },
    {
      id: 2,
      title: "Coding Sprint", // More engaging title
      type: "Development",
      description: "Tackle daily coding problems on LeetCode or HackerRank. Sharpen your algorithmic thinking.",
    },
    {
      id: 3,
      title: "Mindful Moments",
      type: "Wellness",
      description: "Practice 10 minutes of guided meditation each day to enhance focus and reduce stress.",
    }
  ];

  const handleJoinChallenge = (id: number) => {
    // TODO: Implement join challenge functionality
    console.log(`Joining challenge ${id}`);
    // Potentially show a toast notification or update UI state
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Initializing Challenges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-6 sm:p-10 selection:bg-sky-500 selection:text-white">
      <div className="max-w-5xl mx-auto"> {/* Increased max-width */}
        <header className="flex justify-between items-center mb-12 py-4">
           <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
             Challenge<span className="text-blue-500">Platform</span>
           </div>
          {authenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline bg-white dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-mono shadow-sm border border-slate-200 dark:border-slate-700">
                {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-semibold shadow-md hover:shadow-lg"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </header>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-slate-800 dark:text-slate-100 tracking-tight">
          Explore Challenges
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-lg">
          Push your limits. Join a challenge today and unlock your potential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> {/* Grid layout for challenges */}
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl p-6 group transform transition-all duration-300 ease-out hover:-translate-y-1 border border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex flex-col h-full"> {/* Ensure cards in a row have same height potential */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {challenge.title}
                    </h2>
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full
                      ${challenge.type === 'Fitness' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        challenge.type === 'Development' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                      {challenge.type}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {challenge.description}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full mt-auto bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
        <footer className="text-center mt-20 py-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ChallengePlatform. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}