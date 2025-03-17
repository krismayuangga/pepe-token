require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// **1️⃣ Setup Provider & Wallet**
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **2️⃣ Kontrak USDT & Staking**
const USDT_ADDRESS = "0xaaE4d34B027Cd3e38e7f8238f681bD798acA00F7"; // Dummy USDT Contract
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE"; // Staking Contract

// **3️⃣ Load ABI**
const usdtAbi = JSON.parse(fs.readFileSync("./abi/usdtAbi.json", "utf8"));
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, provider);

// **4️⃣ Mengecek Allowance**
async function checkAllowance() {
    try {
        console.log("🔍 Mengecek Allowance USDT...");
        const walletAddress = wallet.address;
        
        const allowance = await usdtContract.allowance(walletAddress, STAKING_CONTRACT_ADDRESS);
        console.log(`💰 Allowance USDT untuk Staking Contract: ${ethers.formatUnits(allowance, 18)} USDT`);
    } catch (error) {
        console.error("❌ ERROR: Gagal mendapatkan allowance USDT:", error);
    }
}

checkAllowance();
