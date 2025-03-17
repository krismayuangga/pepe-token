require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Dummy USDT...");

    // ✅ Deploy tanpa parameter tambahan
    const DummyUSDT = await ethers.getContractFactory("DummyUSDT");
    const dummyUSDT = await DummyUSDT.deploy();
    
    await dummyUSDT.waitForDeployment();

    console.log(`✅ Dummy USDT deployed at: ${dummyUSDT.target}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
