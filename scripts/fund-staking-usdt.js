require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Load RPC URL & Private Key dari .env
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **Alamat Kontrak USDT & Staking**
const USDT_ADDRESS = "0xaaE4d34B027Cd3e38e7f8238f681bD798acA00F7"; // USDT BEP20 di BSC Testnet
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE"; // Update dengan alamat staking terbaru

// **Load ABI dari file JSON**
const usdtAbi = JSON.parse(fs.readFileSync("./abi/usdtAbi.json", "utf8"));
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, wallet);

// **Fungsi untuk mengecek saldo USDT di kontrak staking**
async function checkStakingBalance() {
    const balance = await usdtContract.balanceOf(STAKING_CONTRACT_ADDRESS);
    console.log(`💰 Saldo USDT di kontrak staking: ${ethers.formatEther(balance)} USDT`);
}

// **Fungsi untuk mengirim USDT ke kontrak staking**
async function sendUSDT(amount) {
    console.log(`🔄 Mengirim ${ethers.formatEther(amount)} USDT ke kontrak staking...`);
    
    const tx = await usdtContract.transfer(STAKING_CONTRACT_ADDRESS, amount);
    await tx.wait();
    
    console.log(`✅ Berhasil mengirim ${ethers.formatEther(amount)} USDT ke staking contract: ${tx.hash}`);
}

// **Menjalankan script**
async function main() {
    console.log("🔍 Mengecek saldo USDT di kontrak staking...");
    await checkStakingBalance();

    const args = process.argv.slice(2);
    if (args.includes("--send")) {
        const amount = ethers.parseEther("1000"); // Jumlah USDT yang akan dikirim
        await sendUSDT(amount);
    } else {
        console.log("⚠️ Tidak ada USDT yang dikirim. Jalankan dengan `--send` untuk melakukan transfer.");
    }
}

main().catch(console.error);
