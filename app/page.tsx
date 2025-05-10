"use client";

import { useState } from "react";
import Image from "next/image";
import { usePrivy } from '@privy-io/react-auth';

interface Challenge {
  id: number;
  title: string;
  type: string;
  description: string;
}

export default function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Exercise Challenge",
      type: "Exercise",
      description: "Complete daily push-up and squats",
    },
    {
      id: 2,
      title: "Code Challenge",
      type: "Coding",
      description: "Complete daily coding challenges",
    }
  ];

  const handleJoinChallenge = (id: number) => {
    // TODO: Implement join challenge functionality
    console.log(`Joining challenge ${id}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-8">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300">
                {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Available Challenges
        </h1>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {challenge.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {challenge.type} Challenge
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {challenge.description}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}