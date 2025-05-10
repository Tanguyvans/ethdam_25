"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers'; // Import ethers
import { challengePlatformABI, challengePlatformAddress } from './contracts/challengePlatform'; // Import ABI and address

// Interface matching the contract's Challenge struct
interface ContractChallenge {
  id: bigint; // uint256 maps to bigint
  name: string;
  creator: string; // address maps to string
}

export default function Home() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [challengesList, setChallengesList] = useState<ContractChallenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [contractInstance, setContractInstance] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingTx, setIsProcessingTx] = useState(false);


  // Initialize ethers provider and contract
  useEffect(() => {
    const initializeContract = async () => {
      if (ready && authenticated && user?.wallet) {
        try {
          // @ts-ignore // Privy's getEthereumProvider might not be typed perfectly for ethers v6
          const privyProvider = await user.wallet.getEthereumProvider();
          if (!privyProvider) {
            setError("Could not get Ethereum provider from Privy.");
            return;
          }
          const browserProvider = new BrowserProvider(privyProvider);
          const signer = await browserProvider.getSigner();
          const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
          setContractInstance(contract);
        } catch (e) {
          console.error("Error initializing contract:", e);
          setError("Failed to initialize smart contract connection. Ensure your wallet is connected to the correct network (Sapphire Testnet/Mainnet).");
        }
      } else {
        setContractInstance(null); // Clear contract if not authenticated
      }
    };
    initializeContract();
  }, [ready, authenticated, user?.wallet]);

  // Fetch challenges when contract is initialized
  useEffect(() => {
    if (contractInstance) {
      fetchChallenges();
    } else {
      setChallengesList([]); // Clear challenges if no contract
    }
  }, [contractInstance]);

  const fetchChallenges = async () => {
    if (!contractInstance) {
      setError("Contract not initialized.");
      return;
    }
    setIsLoadingChallenges(true);
    setError(null);
    try {
      const fetchedChallenges = await contractInstance.getAllChallenges();
      // Convert BigInt id to string or number for easier use in React keys/display if needed,
      // but keep as bigint if direct contract interaction requires it.
      // For display, we can format it.
      setChallengesList(fetchedChallenges.map((c: any) => ({
        id: BigInt(c.id), // Ensure it's a bigint
        name: c.name,
        creator: c.creator,
      })));
    } catch (e) {
      console.error("Error fetching challenges:", e);
      setError("Failed to fetch challenges. Make sure you are on the Sapphire network.");
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!contractInstance || !newChallengeName.trim()) {
      setError("Contract not initialized or challenge name is empty.");
      return;
    }
    setIsProcessingTx(true);
    setError(null);
    try {
      const tx = await contractInstance.createChallenge(newChallengeName.trim());
      await tx.wait(); // Wait for the transaction to be mined
      setNewChallengeName(''); // Clear input
      await fetchChallenges(); // Refresh challenges list
    } catch (e:any) {
      console.error("Error creating challenge:", e);
      setError(`Failed to create challenge: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleJoinChallenge = async (challengeId: bigint) => {
    if (!contractInstance) {
      setError("Contract not initialized.");
      return;
    }
    setIsProcessingTx(true);
    setError(null);
    try {
      // First, check if the user has already joined (optional, but good UX)
      // const hasJoined = await contractInstance.hasJoined(challengeId, user?.wallet?.address);
      // if (hasJoined) {
      //   setError("You have already joined this challenge.");
      //   setIsProcessingTx(false);
      //   return;
      // }

      const tx = await contractInstance.joinChallenge(challengeId);
      await tx.wait(); // Wait for the transaction to be mined
      // Potentially show a success message or update UI to reflect joined status
      alert(`Successfully joined challenge ID: ${challengeId.toString()}!`);
      // You might want to re-fetch challenge details or user's joined status here
    } catch (e: any) {
      console.error(`Error joining challenge ${challengeId.toString()}:`, e);
      setError(`Failed to join challenge: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Initializing Wallet Connection...</p> {/* Updated text */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-6 sm:p-10 selection:bg-sky-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
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
                className="bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={isProcessingTx}
              >
                {isProcessingTx ? 'Processing...' : 'Disconnect'}
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {authenticated && contractInstance && (
          <div className="mb-10 p-6 bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create New Challenge</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newChallengeName}
                onChange={(e) => setNewChallengeName(e.target.value)}
                placeholder="Enter challenge name (e.g., Daily Coding)"
                className="flex-grow px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                disabled={isProcessingTx}
              />
              <button
                onClick={handleCreateChallenge}
                className="bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={isProcessingTx || !newChallengeName.trim()}
              >
                {isProcessingTx ? 'Creating...' : 'Create Challenge'}
              </button>
            </div>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-slate-800 dark:text-slate-100 tracking-tight">
          Explore Challenges
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-lg">
          Push your limits. Join a challenge today and unlock your potential.
        </p>

        {isLoadingChallenges && (
          <div className="flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
             <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
            <p>Loading challenges from the blockchain...</p>
          </div>
        )}

        {!isLoadingChallenges && challengesList.length === 0 && authenticated && contractInstance && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-lg">
            No challenges found. Be the first to create one!
          </p>
        )}
         {!isLoadingChallenges && !authenticated && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-lg">
            Please connect your wallet to see and create challenges.
          </p>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {challengesList.map((challenge) => (
            <div
              key={challenge.id.toString()} // Use bigint id as key
              className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl p-6 group transform transition-all duration-300 ease-out hover:-translate-y-1 border border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {challenge.name} {/* Use name from contract */}
                    </h2>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      ID: {challenge.id.toString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-1">
                    Creator: <span className="font-mono text-xs">{challenge.creator}</span>
                  </p>
                  {/* Add more details if needed, e.g., number of participants if you fetch that */}
                </div>
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full mt-auto bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                  disabled={!authenticated || isProcessingTx || !contractInstance} // Disable if not authenticated or processing
                >
                  {isProcessingTx ? 'Joining...' : 'Join Challenge'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <footer className="text-center mt-20 py-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ChallengePlatform. All rights reserved. Contract: <a href={`https://explorer.sapphire.oasis.io/address/${challengePlatformAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{challengePlatformAddress.slice(0,10)}...</a>
          </p>
        </footer>
      </div>
    </div>
  );
}