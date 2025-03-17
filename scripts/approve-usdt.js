require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Load RPC URL & Private Key dari .env
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Alamat kontrak USDT & Staking Contract
const USDT_ADDRESS = "0xaaE4d34B027Cd3e38e7f8238f681bD798acA00F7"; // Dummy USDT
const STAKING_CONTRACT_ADDRESS = "0xaCEbb39ae24f9d83B173b8448020a62a8B8E47fE"; // Staking Contract

// Load ABI dari USDT Contract
const usdtAbi = JSON.parse(fs.readFileSync("./abi/usdtAbi.json", "utf8"));
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, wallet);

async function main() {
    const amount = ethers.parseUnits("1000", 18); // Approve 1000 USDT
    console.log(`🔄 Approving ${ethers.formatUnits(amount, 18)} USDT untuk Staking Contract...`);
    
    const tx = await usdtContract.approve(STAKING_CONTRACT_ADDRESS, amount);
    await tx.wait();
    
    console.log(`✅ Approval sukses! TX: ${tx.hash}`);
}

main().catch(console.error);
