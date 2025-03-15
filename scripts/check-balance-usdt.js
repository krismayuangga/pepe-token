require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// **Load RPC dan Private Key dari .env**
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **Alamat Kontrak USDT & Staking**
const USDT_ADDRESS = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684"; // USDT di BSC Testnet
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE"; // Ganti dengan alamat staking terbaru

// **Load ABI dari JSON**
let usdtAbi;
try {
    const abiPath = "./abi/usdtAbi.json";
    if (!fs.existsSync(abiPath)) {
        throw new Error(`File ABI USDT tidak ditemukan di: ${abiPath}`);
    }
    usdtAbi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
} catch (error) {
    console.error(`❌ ERROR: Gagal memuat ABI USDT: ${error.message}`);
    process.exit(1);
}

// **Buat Instance Kontrak**
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, wallet);

// **Cek Saldo USDT di Kontrak Staking**
async function checkUSDTBalance() {
    try {
        console.log("🔍 Mengecek saldo USDT di kontrak staking...");
        const balance = await usdtContract.balanceOf(STAKING_CONTRACT_ADDRESS);
        console.log(`💰 Saldo USDT di kontrak staking: ${ethers.formatUnits(balance, 18)} USDT`);
    } catch (error) {
        console.error(`❌ ERROR: Gagal mendapatkan saldo USDT: ${error.message}`);
    }
}

checkUSDTBalance();
