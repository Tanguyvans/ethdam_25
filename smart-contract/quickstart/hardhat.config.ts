import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@oasisprotocol/sapphire-hardhat";
// import "./tasks"; // This was the old import, remove or ensure it's correct if it's an index file
import * as dotenv from "dotenv";
import "./tasks/vigilInteractions"; // Assuming you still want this
import "./tasks/deployChallengePlatform"; // Add this line

dotenv.config();

const accounts = process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY.replace(/^0x/, '')}`] : {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};

const config: HardhatUserConfig = {
  solidity: "0.8.19", // Updated to match ChallengePlatform.sol
  networks: {
    hardhat: {}, // Explicitly define hardhat network
    sapphire: {
      url: "https://sapphire.oasis.io",
      chainId: 0x5afe,
      accounts,
    },
    "sapphire-testnet": {
      url: "https://testnet.sapphire.oasis.io",
      accounts,
      chainId: 0x5aff,
    },
    "sapphire-localnet": {
      // docker run -it -p8544-8548:8544-8548 ghcr.io/oasisprotocol/sapphire-localnet
      url: "http://localhost:8545",
      chainId: 0x5afd,
      accounts,
    },
  },
  etherscan: { // Keep this for potential verification if Sourcify fails or for specific explorers
    apiKey: {
        // Example: you would need actual keys for specific sapphire explorers if they use this model
        // sapphireTestnet: process.env.SAPPHIRE_TESTNET_EXPLORER_API_KEY || "",
    },
    customChains: [
        {
            network: "sapphire-testnet",
            chainId: 0x5aff,
            urls: {
                apiURL: "https://testnet.explorer.sapphire.oasis.dev/api", // GUESS - VERIFY THIS URL
                browserURL: "https://testnet.explorer.sapphire.oasis.dev/" // GUESS - VERIFY THIS URL
            }
        },
        {
            network: "sapphire",
            chainId: 0x5afe,
            urls: {
                apiURL: "https://explorer.sapphire.oasis.io/api", // GUESS - VERIFY THIS URL
                browserURL: "https://explorer.sapphire.oasis.io/" // GUESS - VERIFY THIS URL
            }
        }
    ],
    enabled: false // Set to true if you intend to use it and have correct apiURLs/keys
  },
  sourcify: {
    enabled: true // Sourcify will be attempted first if etherscan.enabled is false or fails
  }
};

export default config;
