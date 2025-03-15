const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PEPE Token...");

  // Buat instance kontrak PEPE
  const PEPEToken = await hre.ethers.getContractFactory("PEPEToken");

  // Deploy kontrak
  const pepe = await PEPEToken.deploy();

  // Tunggu hingga deployment selesai
  await pepe.waitForDeployment();

  // Ambil alamat kontrak setelah sukses deploy
  const contractAddress = await pepe.getAddress();
  
  console.log("✅ PEPE Token successfully deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
