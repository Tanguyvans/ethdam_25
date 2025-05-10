# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

npx hardhat full-vigil --network sapphire-testnet
npx hardhat verify --network sapphire-testnet 0x6A7484e85Ce3aEca1fc6f16501505E39aBd505AA

npx hardhat vigil-create-secret --network sapphire-testnet --contract 0x6A7484e85Ce3aEca1fc6f16501505E39aBd505AA --name "MyTestSecret" --longevity 3600 --secret 0x48656c6c6f576f726c64
