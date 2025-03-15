require("dotenv").config();
const { ethers } = require("hardhat");

const STAKING_CONTRACT_ADDRESS = "0xf3C3EC727F0645C40b799Cba144e45ed16831a93"; // Sesuaikan dengan kontrak staking terbaru

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Memproses unstake untuk: ${deployer.address}`);

    // Load Staking Contract
    const staking = await ethers.getContractAt("PEPEStaking", STAKING_CONTRACT_ADDRESS);

    console.log("⏳ Mengirim transaksi unstake...");
    const tx = await staking.unstake();
    await tx.wait();

    console.log(`✅ Unstake berhasil! TX: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
