document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔄 Memeriksa koneksi wallet...");
    await checkWalletConnection();
});

// **Ambil elemen HTML**
const connectButton = document.getElementById("connectWallet");
const stakeButton = document.getElementById("stakeButton");
const unstakeButton = document.getElementById("unstakeButton");
const claimRewardButton = document.getElementById("claimReward");

let provider;
let signer;
let stakingContract;
let pepeTokenContract;

// **Alamat kontrak (UPDATE JIKA ADA PERUBAHAN)**
const STAKING_CONTRACT_ADDRESS = "0x9CbB706643394f6E606dbDc2C2C889cD37783d2A";
const PEPE_TOKEN_ADDRESS = "0xf8FAbd399e2E3B57761929d04d5eEdA13bcA43a5";

// **Memuat ABI dari JSON**
async function loadABI() {
    try {
        const stakingAbiResponse = await fetch("/abi/stakingAbi.json");
        const pepeTokenAbiResponse = await fetch("/abi/pepeTokenAbi.json");

        if (!stakingAbiResponse.ok || !pepeTokenAbiResponse.ok) {
            throw new Error("❌ Gagal memuat ABI. Periksa file ABI di /abi/");
        }

        const stakingAbi = await stakingAbiResponse.json();
        const pepeTokenAbi = await pepeTokenAbiResponse.json();
        return { stakingAbi, pepeTokenAbi };
    } catch (error) {
        console.error("❌ ERROR: Gagal memuat ABI:", error);
        alert("Gagal memuat ABI. Periksa konsol untuk detail.");
    }
}

// **Cek koneksi wallet**
async function checkWalletConnection() {
    if (!window.ethereum) {
        document.getElementById("walletAddress").innerText = "❌ Wallet tidak ditemukan";
        console.log("❌ Wallet tidak ditemukan");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const { stakingAbi, pepeTokenAbi } = await loadABI();
        stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, signer);
        pepeTokenContract = new ethers.Contract(PEPE_TOKEN_ADDRESS, pepeTokenAbi, signer);

        const walletAddress = await signer.getAddress();
        document.getElementById("walletAddress").innerText = walletAddress;
        console.log("✅ Wallet berhasil terhubung:", walletAddress);

        await updateUI();
    } catch (error) {
        console.error("❌ ERROR: Gagal menghubungkan wallet:", error);
    }
}

// **Menghubungkan wallet**
connectButton.addEventListener("click", async () => {
    try {
        console.log("🔄 Menghubungkan ke wallet...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await checkWalletConnection();
    } catch (error) {
        console.error("❌ ERROR: Gagal menghubungkan wallet:", error);
    }
});

// **Perbarui UI dengan data staking**
async function updateUI() {
    try {
        const walletAddress = await signer.getAddress();
        const stakeData = await stakingContract.stakes(walletAddress);

        const stakedAmount = ethers.formatEther(stakeData.amount);
        const rewardAmount = ethers.formatEther(await stakingContract.calculateReward(walletAddress));

        document.getElementById("stakedAmount").innerText = `${stakedAmount} PEPE`;
        document.getElementById("rewardAmount").innerText = `${rewardAmount} PEPE`;
    } catch (error) {
        console.error("❌ ERROR: Gagal memperbarui UI:", error);
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
        console.error("❌ ERROR: Gagal staking:", error);
        alert("❌ Gagal staking! Periksa konsol.");
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
        console.error("❌ ERROR: Gagal unstake:", error);
        alert("❌ Gagal unstake! Periksa konsol.");
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
        console.error("❌ ERROR: Gagal klaim reward:", error);
        alert("❌ Gagal klaim reward! Periksa konsol.");
    }
});

async function updateUI() {
    try {
        const walletAddress = await signer.getAddress();
        const stakeData = await stakingContract.stakes(walletAddress);

        const stakedAmount = ethers.formatEther(stakeData.amount);
        const rewardAmount = ethers.formatEther(await stakingContract.calculateReward(walletAddress));
        const usdtBalance = ethers.formatEther(await stakingContract.getUSDTBalance());

        document.getElementById("stakedAmount").innerText = `${stakedAmount} PEPE`;
        document.getElementById("rewardAmount").innerText = `${rewardAmount} USDT`;
        document.getElementById("usdtBalance").innerText = `USDT Balance: ${usdtBalance}`;

    } catch (error) {
        console.error("❌ Gagal memperbarui UI:", error);
    }
}

async function addUSDT() {
    try {
        const amount = prompt("Masukkan jumlah USDT yang akan ditambahkan:");
        if (!amount || amount <= 0) return;

        console.log(`🚀 Menambahkan ${amount} USDT ke kontrak staking...`);
        const amountInWei = ethers.parseEther(amount);

        const approveTx = await usdtContract.approve(STAKING_CONTRACT_ADDRESS, amountInWei);
        await approveTx.wait();

        const addTx = await stakingContract.addUSDT(amountInWei);
        await addTx.wait();

        console.log("✅ USDT berhasil ditambahkan!");
        alert("✅ USDT berhasil ditambahkan!");

        await updateUI();
    } catch (error) {
        console.error("❌ Gagal menambahkan USDT:", error);
        alert("❌ Gagal menambahkan USDT!");
    }
}
