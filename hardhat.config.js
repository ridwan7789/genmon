try { require("dotenv").config(); } catch {}
require("@nomicfoundation/hardhat-ethers");

/** @type {import("hardhat/config").HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  paths: {
    sources: "./contracts",
  },
  networks: {
    solanaDevnet: {
      url: "https://api.devnet.solana.com",
      chainId: 101,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    solanaMainnet: {
      url: "https://api.mainnet-beta.solana.com",
      chainId: 101,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
