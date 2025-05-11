"use client";

import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { challengePlatformABI, challengePlatformAddress } from './contracts/challengePlatform';

// Updated interface to match the new contract Challenge struct
interface ContractChallenge {
  id: bigint;
  name: string;
  creator: string;
  pool: bigint;
  playerCount: bigint;
  isSettled: boolean;
}

export default function Home() {
  const router = useRouter();
  const { login, logout, authenticated, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const [challengesList, setChallengesList] = useState<ContractChallenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [winnerAddress, setWinnerAddress] = useState('');
  const [participantAddress, setParticipantAddress] = useState('');
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());
  const [passedChallenges, setPassedChallenges] = useState<Set<string>>(new Set());
  const [claimedChallenges, setClaimedChallenges] = useState<Set<string>>(new Set());

  // Get the first connected wallet
  const wallet = wallets[0];

  console.log(wallet);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (privyReady && !authenticated) {
      router.push('/login');
    }
  }, [privyReady, authenticated, router]);

  // Initialize contract and fetch challenges
  useEffect(() => {
    const initializeContract = async () => {
      if (authenticated && wallet) {
        try {
          const provider = await wallet.getEthereumProvider();
          const ethersProvider = new BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
          await fetchChallenges(contract);
        } catch (e) {
          console.error("Error initializing contract:", e);
          setError("Failed to initialize smart contract connection.");
        }
      }
    };
    initializeContract();
  }, [authenticated, wallet]);

  const fetchChallenges = async (contract: Contract) => {
    setIsLoadingChallenges(true);
    setError(null);
    try {
      console.log("Fetching challenges...");
      const fetchedChallenges = await contract.getAllChallenges();
      console.log("Fetched challenges:", fetchedChallenges);
      
      const challenges = fetchedChallenges.map((c: any) => ({
        id: BigInt(c.id),
        name: c.name,
        creator: c.creator,
        pool: BigInt(c.pool),
        playerCount: BigInt(c.playerCount),
        isSettled: c.isSettled,
      }));
      setChallengesList(challenges);

      // Check joined, passed, and claimed status for each challenge
      const joined = new Set<string>();
      const passed = new Set<string>();
      const claimed = new Set<string>();
      
      for (const challenge of challenges) {
        if (wallet) {
          try {
            const hasJoined = await contract.hasJoined(challenge.id, wallet.address);
            const hasPassed = await contract.hasPassed(challenge.id, wallet.address);
            const hasClaimed = await contract.hasClaimed(challenge.id, wallet.address);
            
            if (hasJoined) joined.add(challenge.id.toString());
            if (hasPassed) passed.add(challenge.id.toString());
            if (hasClaimed) claimed.add(challenge.id.toString());
          } catch (e) {
            console.error(`Error checking status for challenge ${challenge.id}:`, e);
          }
        }
      }
      
      setJoinedChallenges(joined);
      setPassedChallenges(passed);
      setClaimedChallenges(claimed);
    } catch (e) {
      console.error("Error fetching challenges:", e);
      setError(`Failed to fetch challenges: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!newChallengeName.trim()) {
      setError("Challenge name is empty.");
      return;
    }
    setIsProcessingTx(true);
    setError(null);
    try {
      if (authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
        
        const tx = await contract.createChallenge(
          newChallengeName.trim()
        );
        await tx.wait();
        setNewChallengeName('');
        await fetchChallenges(contract);
      }
    } catch (e: any) {
      console.error("Error creating challenge:", e);
      setError(`Failed to create challenge: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleJoinChallenge = async (challengeId: bigint) => {
    setIsProcessingTx(true);
    setError(null);
    try {
      if (authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
        
        const tx = await contract.joinChallenge(challengeId, {
          value: ethers.parseEther("1.0") // 1 ROSE
        });
        await tx.wait();
        
        // Update joined status
        setJoinedChallenges(prev => new Set([...prev, challengeId.toString()]));
        
        alert(`Successfully joined challenge ID: ${challengeId.toString()}!`);
      }
    } catch (e: any) {
      console.error(`Error joining challenge ${challengeId.toString()}:`, e);
      setError(`Failed to join challenge: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleMarkPassed = async (challengeId: bigint, participantAddress: string) => {
    setIsProcessingTx(true);
    setError(null);
    try {
      if (authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
        
        const tx = await contract.markChallengePassed(challengeId, participantAddress);
        await tx.wait();
        alert(`Successfully marked participant as passed!`);
      }
    } catch (e: any) {
      console.error(`Error marking participant as passed:`, e);
      setError(`Failed to mark participant as passed: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleSettleChallenge = async (challengeId: bigint) => {
    setIsProcessingTx(true);
    setError(null);
    try {
      if (authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
        
        const tx = await contract.settleChallenge(challengeId);
        await tx.wait();
        alert(`Successfully settled challenge ID: ${challengeId.toString()}!`);
        await fetchChallenges(contract);
      }
    } catch (e: any) {
      console.error(`Error settling challenge ${challengeId.toString()}:`, e);
      setError(`Failed to settle challenge: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleClaimRewards = async (challengeId: bigint) => {
    setIsProcessingTx(true);
    setError(null);
    try {
      if (authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(challengePlatformAddress, challengePlatformABI, signer);
        
        const tx = await contract.claimRewards(challengeId);
        await tx.wait();
        
        // Update claimed status
        setClaimedChallenges(prev => new Set([...prev, challengeId.toString()]));
        
        alert(`Successfully claimed rewards for challenge ID: ${challengeId.toString()}!`);
      }
    } catch (e: any) {
      console.error(`Error claiming rewards:`, e);
      setError(`Failed to claim rewards: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const checkIfJoined = async (contract: Contract, challengeId: bigint) => {
    if (!wallet) return false;
    try {
      const hasJoined = await contract.hasJoined(challengeId, wallet.address);
      return hasJoined;
    } catch (e) {
      console.error("Error checking if joined:", e);
      return false;
    }
  };

  // Loading state
  if (!privyReady || !walletsReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <div className="animate-pulse">Loading wallets...</div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!authenticated) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-6 sm:p-10 selection:bg-sky-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 py-4">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Challenge<span className="text-blue-500">Platform</span>
          </div>
          {wallet && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Connected Wallet
                </span>
                <span className="bg-white dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-mono shadow-sm border border-slate-200 dark:border-slate-700">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={isProcessingTx}
              >
                {isProcessingTx ? 'Processing...' : 'Disconnect'}
              </button>
            </div>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {wallet && (
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

        {!isLoadingChallenges && challengesList.length === 0 && wallet && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-lg">
            No challenges found. Be the first to create one!
          </p>
        )}
         {!isLoadingChallenges && !wallet && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-lg">
            Please connect your wallet to see and create challenges.
          </p>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {challengesList.map((challenge) => (
            <div
              key={challenge.id.toString()}
              className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl p-6 group transform transition-all duration-300 ease-out hover:-translate-y-1 border border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  {challenge.isSettled && (
                    <div className="mb-3">
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                        Settled
                      </span>
                    </div>
                  )}
                  {joinedChallenges.has(challenge.id.toString()) && (
                    <div className="mb-3">
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                        Joined
                      </span>
                    </div>
                  )}
                  {passedChallenges.has(challenge.id.toString()) && (
                    <div className="mb-3">
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full">
                        Passed
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {challenge.name}
                    </h2>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      ID: {challenge.id.toString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p>Creator: <span className="font-mono text-xs">{challenge.creator}</span></p>
                    <p>Pool: {ethers.formatEther(challenge.pool)} ROSE</p>
                    <p>Players: {challenge.playerCount.toString()}</p>
                  </div>
                </div>
                {!challenge.isSettled && (
                  <>
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                      disabled={!wallet || isProcessingTx || joinedChallenges.has(challenge.id.toString())}
                    >
                      {isProcessingTx ? 'Joining...' : 
                       joinedChallenges.has(challenge.id.toString()) ? 'Already Joined' : 
                       'Join Challenge (1 ROSE)'}
                    </button>
                    
                    {wallet && challenge.creator.toLowerCase() === wallet.address.toLowerCase() && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Participant's address"
                            className="w-full px-4 py-2 mb-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                            onChange={(e) => setParticipantAddress(e.target.value)}
                            disabled={isProcessingTx}
                          />
                          <button
                            onClick={() => handleMarkPassed(challenge.id, participantAddress)}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                            disabled={!wallet || isProcessingTx || !participantAddress}
                          >
                            {isProcessingTx ? 'Processing...' : 'Mark as Passed'}
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleSettleChallenge(challenge.id)}
                          className="w-full bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                          disabled={!wallet || isProcessingTx}
                        >
                          {isProcessingTx ? 'Settling...' : 'Settle Challenge'}
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                {challenge.isSettled && passedChallenges.has(challenge.id.toString()) && !claimedChallenges.has(challenge.id.toString()) && (
                  <button
                    onClick={() => handleClaimRewards(challenge.id)}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                    disabled={!wallet || isProcessingTx}
                  >
                    {isProcessingTx ? 'Claiming...' : 'Claim Rewards'}
                  </button>
                )}
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