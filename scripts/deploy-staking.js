require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";  // 🟢 Ganti dengan alamat PEPE token
    const usdtTokenAddress = "0x55d398326f99059ff775485246999027b3197955"; // 🟢 Ganti dengan alamat USDT token

    console.log("🚀 Deploying PEPE Staking Contract...");

    const StakingFactory = await ethers.getContractFactory("PEPEStaking");
    const stakingContract = await StakingFactory.deploy(pepeTokenAddress, usdtTokenAddress);

    await stakingContract.waitForDeployment();
    const stakingAddress = await stakingContract.getAddress();

    console.log(`✅ PEPE Staking successfully deployed to: ${stakingAddress}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
