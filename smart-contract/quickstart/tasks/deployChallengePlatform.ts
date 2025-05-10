import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task('deploy-challenge-platform', 'Deploys the ChallengePlatform contract')
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        console.log(`Deploying ChallengePlatform contract to network: ${hre.network.name}`);
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        const balance = await hre.ethers.provider.getBalance(deployer.address);
        console.log("Account balance:", hre.ethers.formatEther(balance));


        const factory = await hre.ethers.getContractFactory('ChallengePlatform');
        console.log('Deploying ChallengePlatform...');
        const contract = await factory.deploy(); // No constructor arguments

        const dt = contract.deploymentTransaction();
        if (dt) {
            console.log('Deployment Transaction Hash:', dt.hash);
            console.log('Waiting for transaction to be mined...');
            await dt.wait();
        } else {
            console.error("Deployment transaction is null.");
            return;
        }
        
        console.log('Waiting for contract to be deployed...');
        await contract.waitForDeployment();

        const contractAddress = await contract.getAddress();
        console.log('ChallengePlatform contract deployed to address:', contractAddress);
        console.log(`Network: ${hre.network.name}, Address: ${contractAddress}`);

        if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
            console.log("\nTo verify the contract, run the following command (after a few minutes for block explorer indexing):");
            console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
        }
    });