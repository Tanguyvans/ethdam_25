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
CONTRACT_ADDRESS = "0x2c3Cba7E40f0704292BDd9D04d985c9FB20B4ed2"
CONTRACT_ABI = [
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
            }
        ],
        "anonymous": False
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
    }
]

# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

async def hello(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a greeting message."""
    user = update.effective_user
    await update.message.reply_text(
        f'👋 Hello {user.first_name}! How can I help you today?'
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

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Sends a welcome message when the /start command is issued."""
    user = update.effective_user
    await update.message.reply_text(
        f'Hi {user.first_name}! Welcome to the Challenge Platform Bot.\n\n'
        'Available commands:\n'
        '/hello - Get a greeting\n'
        '/challenges - View all current challenges\n'
        '/start - Show this help message'
    )

# Initialize the bot
app = ApplicationBuilder().token("7676994620:AAGlEsmwFa6dPo8HPCXgWWYSJrTd_0JyiJQ").build()

# Add command handlers
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("hello", hello))
app.add_handler(CommandHandler("challenges", challenges))

# Run the bot
app.run_polling()