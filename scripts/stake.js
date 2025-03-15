const { ethers } = require("hardhat");

async function main() {
    const stakingContractAddress = "0x03cA91E88cf7F6D8b934C25A2EB04D09a8923191";  // ✅ Update dengan alamat staking contract
    const amount = ethers.parseEther("100"); // 🟢 Ganti jumlah staking jika perlu

    console.log(`🚀 Melakukan staking ${ethers.formatEther(amount)} PEPE...`);

    const staking = await ethers.getContractAt("PEPEStaking", stakingContractAddress);
    const tx = await staking.stake(amount);
    await tx.wait();

    console.log(`✅ Staking berhasil! TX: ${tx.hash}`);
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exitCode = 1;
});
