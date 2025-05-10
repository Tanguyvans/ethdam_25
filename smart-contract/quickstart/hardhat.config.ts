import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@oasisprotocol/sapphire-hardhat";
// import "./tasks"; // This was the old import, remove or ensure it's correct if it's an index file
import * as dotenv from "dotenv";
import "./tasks/vigilInteractions"; // Assuming you still want this
import "./tasks/deployChallengePlatform"; // Add this line

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sapphire: {
      url: "https://sapphire.oasis.io",
      chainId: 0x5afe,
      accounts: [PRIVATE_KEY],
    },
    sapphireTestnet: {
      url: "https://testnet.sapphire.oasis.dev",
      chainId: 23295,
      accounts: [PRIVATE_KEY],
    },
    "sapphire-localnet": {
      // docker run -it -p8544-8548:8544-8548 ghcr.io/oasisprotocol/sapphire-localnet
      url: "http://localhost:8545",
      chainId: 0x5afd,
      accounts: [PRIVATE_KEY],
    },
  },
    etherscan: {
      enabled: false
    },
    sourcify: {
      enabled: true
    }
};

export default config;