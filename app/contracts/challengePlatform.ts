// 1. Ensure this is a SINGLE array of ABI objects
export const challengePlatformABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "ChallengeCreated",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "creator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ChallengeJoined",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "participant",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "stakeAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ChallengePassed",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "participant",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ChallengeSettled",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "prizeAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "RewardClaimed",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "STAKE_AMOUNT",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "challengeParticipants",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "challenges",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "pool",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "playerCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isSettled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "claimRewards",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "createChallenge",
    "type": "function",
    "inputs": [
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "getChallengeState",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "exists",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "isSettled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "playerCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "pool",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "winnerCount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "hasClaimed",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "hasJoined",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "hasPassed",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "joinChallenge",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "markChallengePassed",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_participant",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "owner",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "players",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "hasPassed",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "hasJoined",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "hasClaimed",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "settleChallenge",
    "type": "function",
    "inputs": [
      {
        "name": "_challengeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "getAllChallenges",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "pool",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "playerCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isSettled",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "internalType": "struct ChallengePlatform.Challenge[]"
      }
    ],
    "stateMutability": "view"
  }
] as const;
  
  // 2. Replace with the actual deployed contract address from the explorer/deployment logs
  export const challengePlatformAddress = "0x22A7d8Bc411dd82a15dF44Eb0543a961639d0201"; // Your verified address