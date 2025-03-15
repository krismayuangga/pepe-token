const { ethers } = require("hardhat");

async function main() {
    const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";
    const stakingContractAddress = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A";

    const signer = (await ethers.getSigners())[0]; // Gunakan akun pertama
    const pepeToken = await ethers.getContractAt("IERC20", pepeTokenAddress, signer);

    console.log("🔄 Mengirim 10,000 PEPE ke kontrak staking...");
    const tx = await pepeToken.transfer(stakingContractAddress, ethers.parseEther("10000"));
    await tx.wait();
    console.log("✅ Berhasil mengirim 10,000 PEPE ke staking contract:", tx.hash);
}

main().catch((error) => {
    console.error("❌ Gagal mengirim PEPE ke staking contract:", error);
    process.exit(1);
});
