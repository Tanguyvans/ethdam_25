// 1. Ensure this is a SINGLE array of ABI objects
export const challengePlatformABI = [
    // Remove the outer '[' and ']' if your ABI is currently like [[...objects...]]
    // It should start directly with { "name": "ChallengeCreated", ... },
    // and continue with other objects, all within this one array.
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
        }
      ],
      "anonymous": false
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
        }
      ],
      "stateMutability": "view"
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
            }
          ],
          "internalType": "struct ChallengePlatform.Challenge[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "name": "getChallengeById",
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
          "name": "",
          "type": "tuple",
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
            }
          ],
          "internalType": "struct ChallengePlatform.Challenge"
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
          "name": "_user",
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
      "name": "isParticipant",
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
      "stateMutability": "nonpayable"
    }
  ] as const;
  
  // 2. Replace with the actual deployed contract address from the explorer/deployment logs
  export const challengePlatformAddress = "0x2c3Cba7E40f0704292BDd9D04d985c9FB20B4ed2"; // Your verified address