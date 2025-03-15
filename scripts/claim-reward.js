const { ethers } = require("hardhat");

async function main() {
  const stakingContractAddress = "0xf3C3EC727F0645C40b799Cba144e45ed16831a93"; // Ganti dengan alamat terbaru jika berubah
  const [deployer] = await ethers.getSigners();

  console.log(`🚀 Mengklaim reward untuk alamat: ${deployer.address}`);

  const staking = await ethers.getContractAt("PEPEStaking", stakingContractAddress);

  const tx = await staking.claimRewards();
  console.log("⏳ Memproses transaksi...");
  
  await tx.wait();

  console.log("✅ Reward berhasil diklaim!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
