require("dotenv").config();
const { ethers } = require("ethers");

// Koneksi ke BSC Testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Alamat kontrak
const stakingContractAddress = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE";
const stakingAbi = require("../abi/stakingAbi.json");

// Buat instance kontrak
const stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, wallet);

async function main() {
    try {
        console.log(`🚀 Mengklaim reward untuk: ${wallet.address}`);
        
        const tx = await stakingContract.claimRewards();
        await tx.wait();
        
        console.log(`✅ Reward berhasil diklaim! TX: ${tx.hash}`);
    } catch (error) {
        console.error("❌ ERROR: Gagal klaim reward:", error);
    }
}

main();
