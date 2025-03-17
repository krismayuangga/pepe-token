require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// ✅ Load ENV
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Alamat Kontrak
const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";
const stakingContractAddress = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE";

// ✅ Load ABI
const pepeTokenAbi = JSON.parse(fs.readFileSync("./abi/pepeTokenAbi.json", "utf8"));

// ✅ Buat Instance Kontrak
const pepeToken = new ethers.Contract(pepeTokenAddress, pepeTokenAbi, wallet);

async function main() {
    console.log("🔍 Mengecek saldo kontrak staking...");
    const balance = await pepeToken.balanceOf(stakingContractAddress);
    console.log(`💰 Saldo kontrak staking: ${ethers.formatEther(balance)} PEPE`);
}

main().catch((error) => {
    console.error("❌ ERROR:", error);
});
