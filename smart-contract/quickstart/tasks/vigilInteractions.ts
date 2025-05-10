import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Vigil } from "../typechain-types"; // Assuming typechain generates types in this path

// Define a shared constant for the contract address or make it a task parameter
// For now, let's make it a required task parameter for flexibility.

task("vigil-create-secret", "Creates a new secret in the Vigil contract")
    .addParam("contract", "The address of the Vigil contract")
    .addParam("name", "The name of the secret")
    .addParam("longevity", "How long (in seconds) the secret should remain so past the creator's last update")
    .addParam("secret", "The secret content (hex string, e.g., 0x1234abcd)")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { contract: contractAddress, name, longevity, secret } = taskArgs;
        const [signer] = await hre.ethers.getSigners();

        console.log(`Interacting with Vigil contract at: ${contractAddress}`);
        console.log(`Creating secret with name: "${name}", longevity: ${longevity}s`);
        console.log(`Signer address: ${signer.address}`);

        const vigilContract = await hre.ethers.getContractAt("Vigil", contractAddress, signer) as Vigil;

        try {
            const tx = await vigilContract.createSecret(name, BigInt(longevity), secret);
            console.log(`Transaction sent. Hash: ${tx.hash}`);
            await tx.wait();
            console.log("Secret created successfully!");

            // You might want to query the emitted event or the new secret's index
            // This requires more complex event parsing or calling getMetas.
        } catch (error) {
            console.error("Error creating secret:", error);
        }
    });

task("vigil-reveal-secret", "Reveals a secret if it has expired")
    .addParam("contract", "The address of the Vigil contract")
    .addParam("index", "The index of the secret to reveal")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { contract: contractAddress, index } = taskArgs;
        const [signer] = await hre.ethers.getSigners(); // Signer might not be strictly needed for a view, but good practice

        console.log(`Interacting with Vigil contract at: ${contractAddress}`);
        console.log(`Attempting to reveal secret at index: ${index}`);

        const vigilContract = await hre.ethers.getContractAt("Vigil", contractAddress, signer) as Vigil;

        try {
            const secretBytes = await vigilContract.revealSecret(BigInt(index));
            console.log("Secret revealed successfully!");
            console.log("Secret (bytes):", secretBytes);
            // To display as string if it's readable text:
            try {
                console.log("Secret (UTF-8 string):", hre.ethers.toUtf8String(secretBytes));
            } catch (e) {
                console.log("Secret is not a valid UTF-8 string, showing hex.");
            }
        } catch (error) {
            console.error("Error revealing secret (it might not be expired or index is invalid):", error);
        }
    });

task("vigil-get-metas", "Retrieves metadata for a range of secrets")
    .addParam("contract", "The address of the Vigil contract")
    .addParam("offset", "The starting index (offset) of secrets to fetch")
    .addParam("count", "The number of secrets to fetch")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { contract: contractAddress, offset, count } = taskArgs;

        console.log(`Interacting with Vigil contract at: ${contractAddress}`);
        console.log(`Fetching ${count} secret metadata items starting from offset ${offset}`);

        const vigilContract = await hre.ethers.getContractAt("Vigil", contractAddress) as Vigil; // Signer not needed for view

        try {
            const metas = await vigilContract.getMetas(BigInt(offset), BigInt(count));
            console.log("Secret Metadatas:");
            metas.forEach((meta, i) => {
                console.log(`  Item ${Number(offset) + i}:`); // Use Number() for display
                console.log(`    Creator: ${meta.creator}`);
                console.log(`    Name: "${meta.name}"`);
                console.log(`    Longevity: ${meta.longevity.toString()} seconds`);
            });
            if (metas.length === 0) {
                console.log("No metadata found for the given range, or range is out of bounds.");
            }
        } catch (error) {
            console.error("Error fetching secret metadata:", error);
        }
    });


task("vigil-refresh-secrets", "Updates the last seen timestamp for the caller")
    .addParam("contract", "The address of the Vigil contract")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { contract: contractAddress } = taskArgs;
        const [signer] = await hre.ethers.getSigners();

        console.log(`Interacting with Vigil contract at: ${contractAddress}`);
        console.log(`Refreshing secrets (updating lastSeen) for signer: ${signer.address}`);

        const vigilContract = await hre.ethers.getContractAt("Vigil", contractAddress, signer) as Vigil;

        try {
            const tx = await vigilContract.refreshSecrets();
            console.log(`Transaction sent. Hash: ${tx.hash}`);
            await tx.wait();
            console.log("Secrets refreshed successfully! Last seen timestamp updated.");
        } catch (error) {
            console.error("Error refreshing secrets:", error);
        }
    });

task("vigil-get-last-seen", "Gets the last seen timestamp for an owner")
    .addParam("contract", "The address of the Vigil contract")
    .addParam("owner", "The address of the owner")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { contract: contractAddress, owner } = taskArgs;
        console.log(`Querying lastSeen for owner ${owner} on contract ${contractAddress}`);
        const vigilContract = await hre.ethers.getContractAt("Vigil", contractAddress) as Vigil;
        try {
            const lastSeenTimestamp = await vigilContract.getLastSeen(owner);
            if (lastSeenTimestamp === 0n) { // BigInt comparison
                 console.log(`Owner ${owner} has never been seen or timestamp is 0.`);
            } else {
                console.log(`Owner ${owner} last seen at timestamp: ${lastSeenTimestamp.toString()}`);
                console.log(`Which is: ${new Date(Number(lastSeenTimestamp) * 1000).toLocaleString()}`);
            }
        } catch (e) {
            console.error("Error getting last seen:", e);
        }
    });