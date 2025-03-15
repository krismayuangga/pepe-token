require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ✅ Pastikan ENV sudah terisi dengan benar
if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
    console.error("❌ ERROR: RPC_URL atau PRIVATE_KEY tidak ditemukan di .env");
    process.exit(1);
}

// 🚀 Koneksi ke BSC Testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Pastikan alamat kontrak sesuai
const pepeTokenAddress = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5"; // PEPE Token Address
const stakingContractAddress = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A"; // Staking Contract Address

// ✅ Load ABI dengan pengecekan error
let pepeTokenAbi, stakingAbi;
try {
    pepeTokenAbi = JSON.parse(fs.readFileSync("./abi/pepeTokenAbi.json", "utf8"));
    stakingAbi = JSON.parse(fs.readFileSync("./abi/stakingAbi.json", "utf8"));
} catch (error) {
    console.error("❌ ERROR: Gagal memuat file ABI. Pastikan folder 'abi/' ada dan berisi file yang benar.");
    process.exit(1);
}

// ✅ Buat instance kontrak
const pepeToken = new ethers.Contract(pepeTokenAddress, pepeTokenAbi, wallet);
const stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, wallet);

// 🚀 Buat Express Server
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Menyajikan file ABI melalui server
app.use('/abi', express.static(path.join(__dirname, 'abi')));

// 📌 Cek Koneksi ke BSC Testnet
app.get("/check-network", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        res.json({ success: true, message: `✅ Koneksi berhasil. Block saat ini: ${latestBlock}` });
    } catch (error) {
        console.error("❌ ERROR: Gagal terhubung ke jaringan:", error);
        res.status(500).json({ success: false, error: "Gagal terhubung ke jaringan BSC Testnet" });
    }
});

// 📌 Cek Saldo Staking Contract
app.get("/staking-balance", async (req, res) => {
    try {
        const balance = await pepeToken.balanceOf(stakingContractAddress);
        res.json({ success: true, balance: ethers.formatEther(balance) });
    } catch (error) {
        console.error("❌ ERROR: Gagal mendapatkan saldo staking:", error);
        res.status(500).json({ success: false, error: "Gagal mendapatkan saldo staking" });
    }
});

// 📌 Cek Status Wallet (Apakah Terkoneksi)
app.get("/wallet-status", async (req, res) => {
    try {
        const walletAddress = wallet.address;
        res.json({ success: true, walletConnected: !!walletAddress, address: walletAddress });
    } catch (error) {
        res.json({ success: false, walletConnected: false });
    }
});

// 📌 Endpoint untuk staking
app.post("/stake", async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ success: false, error: "Jumlah stake harus diberikan" });

        console.log(`🔄 Staking ${amount} PEPE...`);
        const tx = await stakingContract.stake(ethers.parseEther(amount));
        await tx.wait();
        console.log(`✅ Staking berhasil! TX: ${tx.hash}`);

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("❌ ERROR: Staking gagal:", error);
        res.status(500).json({ success: false, error: "Staking gagal" });
    }
});

// 📌 Endpoint untuk klaim reward
app.post("/claim-reward", async (req, res) => {
    try {
        console.log("🔄 Mengklaim reward...");
        const tx = await stakingContract.claimRewards();
        await tx.wait();
        console.log(`✅ Reward berhasil diklaim! TX: ${tx.hash}`);

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("❌ ERROR: Klaim reward gagal:", error);
        res.status(500).json({ success: false, error: "Klaim reward gagal" });
    }
});

// 📌 Endpoint untuk unstake
app.post("/unstake", async (req, res) => {
    try {
        console.log("🔄 Memproses unstake...");
        const tx = await stakingContract.unstake();
        await tx.wait();
        console.log(`✅ Unstake berhasil! TX: ${tx.hash}`);

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("❌ ERROR: Unstake gagal:", error);
        res.status(500).json({ success: false, error: "Unstake gagal" });
    }
});

// 🚀 Mulai server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend berjalan di http://localhost:${PORT}`);
});
