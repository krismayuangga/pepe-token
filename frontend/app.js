document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔄 Memeriksa koneksi wallet...");
    await checkWalletConnection();
});

const connectButton = document.getElementById("connectWallet");
const stakeButton = document.getElementById("stakeButton");
const unstakeButton = document.getElementById("unstakeButton");
const claimRewardButton = document.getElementById("claimRewardButton");

let provider;
let signer;
let stakingContract;
let pepeTokenContract;

// **Alamat kontrak**
const STAKING_CONTRACT_ADDRESS = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A";  // Ganti dengan alamat terbaru jika ada perubahan
const PEPE_TOKEN_ADDRESS = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";

// **Memuat ABI dari JSON**
async function loadABI() {
    const stakingAbiResponse = await fetch("/abi/stakingAbi.json");
    const pepeTokenAbiResponse = await fetch("/abi/pepeTokenAbi.json");
    

    const stakingAbi = await stakingAbiResponse.json();
    const pepeTokenAbi = await pepeTokenAbiResponse.json();

    return { stakingAbi, pepeTokenAbi };
}

// **Cek koneksi wallet**
async function checkWalletConnection() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const { stakingAbi, pepeTokenAbi } = await loadABI();
        stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, signer);
        pepeTokenContract = new ethers.Contract(PEPE_TOKEN_ADDRESS, pepeTokenAbi, signer);

        const walletAddress = await signer.getAddress();
        document.getElementById("walletStatus").innerHTML = `✅ Wallet Connected`;
        document.getElementById("walletAddress").innerText = walletAddress;

        console.log("✅ Wallet berhasil terhubung:", walletAddress);
        await updateUI();
    } else {
        document.getElementById("walletStatus").innerHTML = `❌ Wallet tidak ditemukan`;
        console.log("❌ Wallet tidak ditemukan");
    }
}

// **Menghubungkan wallet**
connectButton.addEventListener("click", async () => {
    try {
        console.log("🔄 Menghubungkan ke wallet...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await checkWalletConnection();
    } catch (error) {
        console.error("❌ Gagal menghubungkan wallet:", error);
    }
});

// **Cek status staking & rewards**
async function updateUI() {
    try {
        const walletAddress = await signer.getAddress();
        const stakeData = await stakingContract.stakes(walletAddress);

        const stakedAmount = ethers.formatEther(stakeData.amount);
        const rewardAmount = ethers.formatEther(await stakingContract.calculateReward(walletAddress));

        document.getElementById("stakedAmount").innerText = `${stakedAmount} PEPE`;
        document.getElementById("rewardAmount").innerText = `${rewardAmount} PEPE`;
    } catch (error) {
        console.error("❌ Gagal memperbarui UI:", error);
    }
}

// **Fungsi Staking**
stakeButton.addEventListener("click", async () => {
    try {
        const amount = document.getElementById("stakeAmount").value;
        if (!amount || amount <= 0) {
            alert("Masukkan jumlah PEPE yang valid untuk staking!");
            return;
        }

        console.log(`🚀 Staking ${amount} PEPE...`);
        const amountInWei = ethers.parseEther(amount);

        const approveTx = await pepeTokenContract.approve(STAKING_CONTRACT_ADDRESS, amountInWei);
        await approveTx.wait();

        const stakeTx = await stakingContract.stake(amountInWei);
        await stakeTx.wait();

        console.log("✅ Staking berhasil!");
        alert("✅ Staking berhasil!");

        await updateUI();
    } catch (error) {
        console.error("❌ Gagal staking:", error);
        alert("❌ Gagal staking!");
    }
});

// **Fungsi Unstake**
unstakeButton.addEventListener("click", async () => {
    try {
        console.log("🚀 Memproses unstake...");
        const unstakeTx = await stakingContract.unstake();
        await unstakeTx.wait();

        console.log("✅ Unstake berhasil!");
        alert("✅ Unstake berhasil!");

        await updateUI();
    } catch (error) {
        console.error("❌ Gagal unstake:", error);
        alert("❌ Gagal unstake!");
    }
});

// **Fungsi Klaim Reward**
claimRewardButton.addEventListener("click", async () => {
    try {
        console.log("🚀 Mengklaim reward...");
        const claimTx = await stakingContract.claimRewards();
        await claimTx.wait();

        console.log("✅ Reward berhasil diklaim!");
        alert("✅ Reward berhasil diklaim!");

        await updateUI();
    } catch (error) {
        console.error("❌ Gagal klaim reward:", error);
        alert("❌ Gagal klaim reward!");
    }
});
