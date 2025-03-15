const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PEPE Staking Contract...");

  const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5"; // GANTI DENGAN ALAMAT TOKEN PEPE YANG SUDAH DEPLOY
  
  const PEPEStaking = await hre.ethers.getContractFactory("PEPEStaking");
  const pepeStaking = await PEPEStaking.deploy(pepeTokenAddress);

  await pepeStaking.waitForDeployment();

  console.log(`✅ PEPE Staking successfully deployed to: ${await pepeStaking.getAddress()}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
