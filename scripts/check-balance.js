require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// ✅ Load ENV
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Alamat Kontrak
const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";
const stakingContractAddress = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A";

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
