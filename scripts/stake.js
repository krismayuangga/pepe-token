require("dotenv").config();
const { ethers } = require("ethers");

// 🔗 Koneksi ke BSC Testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// **Alamat Kontrak**
const STAKING_CONTRACT_ADDRESS = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A";
const PEPE_TOKEN_ADDRESS = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";
const stakingAbi = require("../abi/stakingAbi.json");
const pepeTokenAbi = require("../abi/pepeTokenAbi.json");

const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, wallet);
const pepeTokenContract = new ethers.Contract(PEPE_TOKEN_ADDRESS, pepeTokenAbi, wallet);

async function main() {
    try {
        const amount = "100"; // **Ubah jumlah PEPE yang ingin di-stake**
        console.log(`🚀 Melakukan staking ${amount} PEPE...`);

        const amountInWei = ethers.parseEther(amount);
        const approveTx = await pepeTokenContract.approve(STAKING_CONTRACT_ADDRESS, amountInWei);
        await approveTx.wait();
        console.log(`✅ Approve berhasil! TX: ${approveTx.hash}`);

        const stakeTx = await stakingContract.stake(amountInWei);
        await stakeTx.wait();
        console.log(`✅ Staking berhasil! TX: ${stakeTx.hash}`);
    } catch (error) {
        console.error("❌ ERROR: Gagal staking:", error);
    }
}

main();
