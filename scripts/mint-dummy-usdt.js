require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const WALLET_ADDRESS = "0x8C41774Ac950B287D6dcFD51ABA48e46f0815eE1"; // Ganti dengan wallet Anda
    const DUMMY_USDT_ADDRESS = "0xaaE4d34B027Cd3e38e7f8238f681bD798acA00F7"; // Alamat Dummy USDT yang baru

    console.log(`🚀 Minting USDT ke Wallet: ${WALLET_ADDRESS}...`);

    // ✅ Hubungkan ke kontrak
    const DummyUSDT = await ethers.getContractAt("DummyUSDT", DUMMY_USDT_ADDRESS);
    const tx = await DummyUSDT.mint(WALLET_ADDRESS, ethers.parseEther("1000")); // Mint 1000 USDT

    await tx.wait();
    console.log(`✅ Minting berhasil! TX: ${tx.hash}`);
}

main().catch((error) => {
    console.error("❌ Minting gagal:", error);
    process.exit(1);
});
