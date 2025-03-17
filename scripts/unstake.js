require("dotenv").config();
const { ethers } = require("ethers");

// 🔗 Koneksi ke BSC Testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **Alamat Kontrak**
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE";
const stakingAbi = require("../abi/stakingAbi.json");

const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, wallet);

async function main() {
    try {
        console.log(`🚀 Memproses unstake untuk: ${wallet.address}`);
        const tx = await stakingContract.unstake();
        await tx.wait();
        console.log(`✅ Unstake berhasil! TX: ${tx.hash}`);
    } catch (error) {
        console.error("❌ ERROR: Gagal unstake:", error);
    }
}

main();
