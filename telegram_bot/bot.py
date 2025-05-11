import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from web3 import Web3
from eth_abi import decode

load_dotenv()

# Initialize Web3
w3 = Web3(Web3.HTTPProvider('https://testnet.sapphire.oasis.dev'))

# Contract address and ABI from your challengePlatform.ts
CONTRACT_ADDRESS = "0x22A7d8Bc411dd82a15dF44Eb0543a961639d0201"
CONTRACT_ABI = [
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
        "indexed": True,
        "internalType": "uint256"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": False,
        "internalType": "string"
      },
      {
        "name": "creator",
        "type": "address",
        "indexed": True,
        "internalType": "address"
      }
    ],
    "anonymous": False
  },
  {
    "name": "ChallengeJoined",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": True,
        "internalType": "uint256"
      },
      {
        "name": "participant",
        "type": "address",
        "indexed": True,
        "internalType": "address"
      },
      {
        "name": "stakeAmount",
        "type": "uint256",
        "indexed": False,
        "internalType": "uint256"
      }
    ],
    "anonymous": False
  },
  {
    "name": "ChallengePassed",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": True,
        "internalType": "uint256"
      },
      {
        "name": "participant",
        "type": "address",
        "indexed": True,
        "internalType": "address"
      }
    ],
    "anonymous": False
  },
  {
    "name": "ChallengeSettled",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": True,
        "internalType": "uint256"
      },
      {
        "name": "prizeAmount",
        "type": "uint256",
        "indexed": False,
        "internalType": "uint256"
      }
    ],
    "anonymous": False
  },
  {
    "name": "RewardClaimed",
    "type": "event",
    "inputs": [
      {
        "name": "challengeId",
        "type": "uint256",
        "indexed": True,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "indexed": True,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": False,
        "internalType": "uint256"
      }
    ],
    "anonymous": False
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
]

# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# Your channel ID (replace with your actual channel ID)
CHANNEL_ID = "@zerofail_ethdam"  # Replace this with your channel username or ID

async def hello(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a greeting message."""
    user = update.effective_user
    await update.message.reply_text(
        f'👋 Hello {user.first_name}! How can I help you today ?'
    )


async def challenges(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Fetches and displays all challenges from the smart contract."""
    try:
        # Fetch challenges from contract
        challenges = contract.functions.getAllChallenges().call()

        if not challenges:
            await update.message.reply_text("No challenges found.")
            return

        # Format the challenges into a readable message
        message = "📋 *Current Challenges*\n\n"
        for challenge in challenges:
            challenge_id = challenge[0]
            name = challenge[1]
            creator = challenge[2]

            # Format the message for each challenge
            message += f"*Challenge {challenge_id}*\n"
            message += f"Name: {name}\n"
            message += f"Creator: {creator[:6]}...{creator[-4:]}\n\n"

        # Send the formatted message
        await update.message.reply_text(
            message,
            parse_mode='Markdown'
        )
    except Exception as e:
        await update.message.reply_text(
            f"Error fetching challenges: {str(e)}"
        )



async def notify(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Fetches the last challenge and sends it to both the channel and user."""
    try:
        # Fetch challenges from contract
        challenges = contract.functions.getAllChallenges().call()

        if not challenges:
            await update.message.reply_text("No challenges found.")
            return

        # Get the last challenge (most recent)
        last_challenge = challenges[-1]
        challenge_id = last_challenge[0]
        name = last_challenge[1]
        creator = last_challenge[2]

        # Format the message for the last challenge
        message = "📋 *Latest Challenge*\n\n"
        message += f"*Challenge {challenge_id}*\n"
        message += f"Name: {name}\n"
        message += f"Creator: {creator[:6]}...{creator[-4:]}\n\n"
        message += "🌐 [View Challenge Page](https://tanguyvans.github.io/ethdam_25/)"

        # Send to channel
        await context.bot.send_message(
            chat_id=CHANNEL_ID,
            text=message,
            parse_mode='Markdown'
        )

        # Confirm to the user who triggered the command
        await update.message.reply_text("✅ Latest challenge has been posted to the channel!")

    except Exception as e:
        await update.message.reply_text(
            f"Error: {str(e)}"
        )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a welcome message when the /start command is issued."""
    await update.message.reply_text(
        'Welcome to the Challenge Platform Bot.\n\n'
        'Available commands:\n'
        '/notify - Send hello world to the channel\n'
        '/start - Show this help message'
    )

# Initialize the bot
app = ApplicationBuilder().token("7676994620:AAGlEsmwFa6dPo8HPCXgWWYSJrTd_0JyiJQ").build()

# Add command handlers
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("hello", hello))
app.add_handler(CommandHandler("challenges", challenges))
app.add_handler(CommandHandler("notify", notify))

# Run the bot
app.run_polling()