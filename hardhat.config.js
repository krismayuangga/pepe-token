require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://bsc-testnet.publicnode.com", // RPC stabil
      accounts: [process.env.PRIVATE_KEY],
      timeout: 120000, // Tambahkan timeout 120 detik (2 menit)
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: "UP2CM4TWQNMEW22E66SVMP83SJV579IHZA", // API Key dari BscScan
    },
  },
};
