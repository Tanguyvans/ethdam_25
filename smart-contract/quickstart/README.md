create a .env file with:
PRIVATE_KEY=0x..

avoir des faucet: https://faucet.testnet.oasis.dev/?__cf_chl_tk=yDWzS1kbZCHB7zA4Gc2poYqHOwYPz17i7yhDvdoqW30-1746798479-1.0.1.1-eWtoO9LqwSruobS56vg7jmnGotqHjJLt6lWeWDqHvMw

npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv

# Clean the artifacts

npx hardhat clean

# Compile the contracts

npx hardhat compile

# Deploy the contract

npx hardhat deploy-challenge-platform --network sapphireTestnet

# verify the contract:

npx hardhat verify --network sapphireTestnet ["contract address"]
