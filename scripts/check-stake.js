require("dotenv").config();
const { ethers } = require("ethers");

// 🚀 Pastikan RPC_URL dan PRIVATE_KEY ada di .env
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **Alamat kontrak terbaru**
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE";

// **Load ABI**
const stakingAbi = require("../abi/stakingAbi.json");

// **Buat instance kontrak staking**
const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, wallet);

async function main() {
    try {
        const walletAddress = await wallet.getAddress();
        console.log(`🔍 Mengecek staking untuk ${walletAddress}...`);

        const stakeData = await stakingContract.stakes(walletAddress);
        const rewardAmount = await stakingContract.calculateReward(walletAddress);

        console.log(`✅ Informasi Staking:`);
        console.log(`Jumlah Staked: ${ethers.formatEther(stakeData.amount)} PEPE`);
        console.log(`Waktu Mulai Staking: ${stakeData.startTime}`);
        console.log(`💰 Reward Saat Ini: ${ethers.formatEther(rewardAmount)} PEPE`);
    } catch (error) {
        console.error("❌ ERROR: Gagal mengecek staking:", error);
    }
}

main();
