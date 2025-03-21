const axios = require("axios");
const bitcore = require("bitcore-lib");
const TESTNET = true;
const { PrivateKey } = require("bitcore-lib");
const ethers = require("ethers");

const tokenAbi = require("../public/token.json");
const relayerAbi = require("../public/relayer.json");


const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");

const getAllUtxos = async (sourceAddress) => {
  const resp = await axios({
    method: "GET",
    url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
  });
  const utxos = resp.data;

  return utxos;
};

const sendBitcoin = async (recieverAddress, amountToSend) => {
  try {
    const privateKey = "345cd55dcc26dd0e19de4abcb5b3af94bea058f053885a16bf3f99d3dd623cd8";
    const sourceAddress = "n2eFHAKaWrFigwmyG5tibcDQNyFt5zu7qi";
    const satoshiToSend = amountToSend * 100000000;

    console.log("🚀 Starting Bitcoin transfer from User Wallet");
    console.log("📤 Sending from address:", sourceAddress);
    console.log("📥 Receiver address:", recieverAddress);
    console.log("💸 Amount to send (in satoshis):", satoshiToSend);

    let fee = 0;
    let inputCount = 0;
    const outputCount = 2;

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;
    let inputs = [];

    console.log("🔎 Fetching UTXOs for source address...");

    // 1. Fetch UTXOs for the source address
    const resp = await axios.get(`https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`);
    const utxos = resp.data;

    console.log("📦 UTXOs found:", utxos.length);
    console.log("🧮 Building inputs from UTXOs...");
    console.log("UTXOs", utxos);

    // 2. Build inputs and calculate total available balance
    for (const utxo of utxos) {
      const input = {
        satoshis: utxo.value,
        script: bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex(),
        address: sourceAddress,
        txId: utxo.txid,
        outputIndex: utxo.vout,
      };
      totalAmountAvailable += utxo.value;
      inputCount++;
      inputs.push(input);
    }

    console.log("💰 Total balance available:", totalAmountAvailable, "satoshis");

    // 3. Estimate transaction size and fee
    const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
    fee = TESTNET ? transactionSize * 1 : transactionSize * 20; // 1 sat/byte on testnet

    console.log("📐 Estimated transaction size:", transactionSize, "bytes");
    console.log("🧾 Estimated fee:", Math.round(fee), "satoshis");

    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("❌ Balance is too low for this transaction");
    }

    // 4. Build the transaction
    transaction.from(inputs);
    transaction.to(recieverAddress, satoshiToSend);
    transaction.change(sourceAddress);
    transaction.fee(Math.round(fee));

    console.log("✍️ Signing transaction with private key...");
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();
    console.log("📤 Broadcasting transaction to Bitcoin Testnet...");

    // 5. Broadcast transaction
    const result = await axios.post(`https://blockstream.info/testnet/api/tx`, serializedTransaction);

    console.log("✅ Transaction successfully broadcasted!");
    console.log("🔗 Bitcoin Tx Hash:", result.data);

    return result.data;

  } catch (error) {
    console.error("❌ Error during Bitcoin send:", error.message || error);
    return error;
  }
};

const sendBitcoinFromVault = async (recieverAddress, amountToSend) => {
  try {
    const privateKey = "97585ac2f778c6b28656b2ad4a6099d5f4abb2f4ff4637971855ee9873e9d552";
    const sourceAddress = "n1fWbd9xo4NaHKhYqnNBXkrFdrRSbTNKHo";
    const satoshiToSend = amountToSend * 100000000; // Convert BTC to satoshis

    console.log("🚀 Starting Bitcoin transfer from Vault");
    console.log("📤 Sending from Vault address:", sourceAddress);
    console.log("📥 Receiver address:", recieverAddress);
    console.log("💸 Amount to send (in satoshis):", satoshiToSend);

    let fee = 0;
    let inputCount = 0;
    const outputCount = 2;

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;
    let inputs = [];

    console.log("🔎 Fetching UTXOs for source address...");

    // 1. Fetch UTXOs for the source address
    const resp = await axios.get(`https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`);
    const utxos = resp.data;

    console.log("📦 UTXOs found:", utxos.length);
    console.log("🧮 Building inputs from UTXOs...");
    console.log("UTXO", utxos);

    // 2. Build input list and calculate total balance
    for (const utxo of utxos) {
      const input = {
        satoshis: utxo.value,
        script: bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex(),
        address: sourceAddress,
        txId: utxo.txid,
        outputIndex: utxo.vout,
      };
      totalAmountAvailable += utxo.value;
      inputCount++;
      inputs.push(input);
    }

    console.log("💰 Total balance available:", totalAmountAvailable, "satoshis");

    // 3. Estimate transaction size and fee
    const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
    fee = TESTNET ? transactionSize * 1 : transactionSize * 20; // 1 sat/byte for testnet

    console.log("📐 Estimated transaction size:", transactionSize, "bytes");
    console.log("🧾 Estimated fee:", Math.round(fee), "satoshis");

    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("❌ Balance is too low for this transaction");
    }

    // 4. Create transaction
    transaction.from(inputs);
    transaction.to(recieverAddress, satoshiToSend);
    transaction.change(sourceAddress);
    transaction.fee(Math.round(fee));

    console.log("✍️ Signing transaction...");
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();
    console.log("📤 Broadcasting transaction to Bitcoin Testnet...");

    // 5. Broadcast to the network
    const result = await axios.post(`https://blockstream.info/testnet/api/tx`, serializedTransaction);

    console.log("✅ Transaction successfully broadcasted!");
    console.log("🔗 Bitcoin Tx Hash:", result);
    return result.data;

  } catch (error) {
    console.error("❌ Error during Bitcoin vault send:", error.message || error);
    return error;
  }
};

const createWallet = (network = mainnet) => {
  var privateKey = new PrivateKey();
  var address = privateKey.toAddress(network);
  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};

const createHDWallet = (network = mainnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.SPANISH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };
};

const relayer = async (address, amountArray) => {
  // Sum up all amounts to get the total payout
  const totalAmount = amountArray.reduce((acc, curr) => acc + curr, 0);
  console.log("🚀 Starting payout process...");
  console.log("🌐 Using RPC URL:", process.env.RPC_URL);
  console.log("🔐 Using Wallet Private Key (last 6 chars):", process.env.PRIVATE_KEY.slice(-6)); // don't leak full key

  // Initialize Ethers provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Initialize contract instances
  const contract = new ethers.Contract(process.env.contractAddress, relayerAbi.abi, signer);
  const token = new ethers.Contract(process.env.tokenAddress, tokenAbi.abi, signer);

  try {
    console.log("📝 Preparing payout transaction...");
    const parsedAmountArray = amountArray.map(amount => ethers.parseEther(amount.toString()));
    const parsedTotalAmount = ethers.parseEther(totalAmount.toString());

    console.log("🧮 Parsed total amount to approve:", parsedTotalAmount.toString());
    console.log("📬 Approving token spend on Relayer contract...");

    // 1. Approve the Relayer contract to spend the token
    const approveTx = await token.approve(process.env.contractAddress, parsedTotalAmount);
    console.log("⏳ Waiting for approval tx to be mined...");
    await approveTx.wait();
    console.log("✅ Token approval confirmed:", approveTx.hash);

    // 2. Call the payout function on the relayer contract
    console.log("📤 Calling Relayer contract to make payment...");
    const tx = await contract.make_payment(address, parsedAmountArray);

    console.log("⏳ Waiting for payout transaction to be mined...");
    await tx.wait();

    console.log("✅ Payout successful!");
    console.log("🔗 Ethereum Transaction Hash:", tx.hash);

    return tx.hash;
  } catch (error) {
    console.error("❌ Error in makePayout:", error);
  }
};


const verifyTransaction = async (txHash, tokenAddress, sender, recipientAddresses, amounts) => {
  const TRANSFER_EVENT_SIGNATURE = ethers.id("Transfer(address,address,uint256)");

  console.log("🔎 Starting transaction verification...");
  console.log("🔗 Transaction Hash:", txHash);
  console.log("🪙 Token Contract Address:", tokenAddress);
  console.log("📤 Sender:", sender);
  console.log("📥 Recipients:", recipientAddresses);
  console.log("💸 Expected Amounts:", amounts);

  // Convert all amounts to BigInt (in wei)
  const expectedTotalAmount = amounts
    .map(amount => ethers.parseEther(amount.toString()))
    .reduce((acc, curr) => acc + curr, 0n);

  console.log("🧮 Calculated expected total token amount (wei):", expectedTotalAmount.toString());

  // Fetch the transaction receipt
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const receipt = await provider.getTransactionReceipt(txHash);

  if (!receipt) {
    console.error("❌ Transaction receipt not found. Cannot verify transaction.");
    return { status: false };
  }

  console.log("📬 Transaction receipt fetched. Scanning logs...");

  let actualTotalAmount = ethers.toBigInt(0);

  // Loop through all logs to find Transfer events from the token contract
  for (const log of receipt.logs) {
    if (
      log.address.toLowerCase() === tokenAddress.toLowerCase() &&
      log.topics[0] === TRANSFER_EVENT_SIGNATURE
    ) {
      try {
        const from = ethers.getAddress(
          ethers.AbiCoder.defaultAbiCoder().decode(["address"], log.topics[1])[0]
        );
        const to = ethers.getAddress(
          ethers.AbiCoder.defaultAbiCoder().decode(["address"], log.topics[2])[0]
        );
        const amount = ethers.toBigInt(log.data);

        console.log(`🔍 Found Transfer event → From: ${from} | To: ${to} | Amount: ${amount.toString()} wei`);

        // Count it only if it's from the sender to one of the recipients
        if (
          from.toLowerCase() === sender.toLowerCase() &&
          recipientAddresses.map(a => a.toLowerCase()).includes(to.toLowerCase())
        ) {
          actualTotalAmount += amount;
          console.log("✅ Matching transfer found. Added to total.");
        } else {
          console.log("🚫 Transfer ignored (doesn't match sender or recipients).");
        }
      } catch (error) {
        console.error("⚠️ Error decoding log entry:", error);
      }
    }
  }

  console.log("🔢 Total transferred amount (wei):", actualTotalAmount.toString());

  // Final comparison
  if (actualTotalAmount === expectedTotalAmount) {
    console.log("🎯 Success: Total amount sent matches expected amount.");
    return { status: true, totalAmount: actualTotalAmount.toString() };
  } else {
    console.error("❌ Verification failed: Mismatch in amounts.");
    console.error("   Expected:", expectedTotalAmount.toString());
    console.error("   Actual:  ", actualTotalAmount.toString());
    return { status: false, totalAmount: actualTotalAmount.toString() };
  }
};


module.exports = {
  sendBitcoin,
  getAllUtxos,
  createWallet,
  createHDWallet,
  sendBitcoinFromVault,
  relayer,
  verifyTransaction
};
