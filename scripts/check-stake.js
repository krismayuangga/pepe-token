const { ethers } = require("hardhat");

async function main() {
    const stakingContractAddress = "0x03cA91E88cf7F6D8b934C25A2EB04D09a8923191";
    const stakingContract = await ethers.getContractAt("PEPEStaking", stakingContractAddress);

    const [deployer] = await ethers.getSigners();

    const stakeData = await stakingContract.stakes(deployer.address);
    const reward = await stakingContract.calculateReward(deployer.address);

    console.log("✅ Informasi Staking:");
    console.log("Jumlah Staked:", ethers.formatEther(stakeData.amount), "PEPE");
    console.log("Waktu Mulai Staking:", stakeData.startTime.toString());
    console.log("💰 Reward Saat Ini:", ethers.formatEther(reward), "PEPE");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
