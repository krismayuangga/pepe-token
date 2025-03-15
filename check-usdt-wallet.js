require("dotenv").config();
const { ethers } = require("ethers");

// Buat koneksi ke BSC Testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ABI Minimal untuk balanceOf di ERC20 Token
const usdtAbi = [
    {
        "constant": true,
        "inputs": [{ "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Alamat kontrak USDT di BSC Testnet
const USDT_ADDRESS = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684"; 
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, provider);

// Fungsi untuk mengecek saldo USDT di wallet
async function checkBalance() {
    const walletAddress = wallet.address;
    const balance = await usdtContract.balanceOf(walletAddress);
    console.log("💰 Saldo USDT di Wallet:", ethers.formatUnits(balance, 18), "USDT");
}

// Jalankan fungsi cek saldo
checkBalance();
