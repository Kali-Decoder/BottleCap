const axios = require("axios");
const bitcore = require("bitcore-lib");
const TESTNET = true;
const { PrivateKey } = require("bitcore-lib");
const ethers = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

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
    const privateKey =
      "345cd55dcc26dd0e19de4abcb5b3af94bea058f053885a16bf3f99d3dd623cd8";
    const sourceAddress = "n2eFHAKaWrFigwmyG5tibcDQNyFt5zu7qi";
    const satoshiToSend = amountToSend * 100000000;
    console.log(satoshiToSend);
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;

    // const recommendedFee = await axios.get(
    //   "https://bitcoinfees.earn.com/api/v1/fees/recommended"
    // );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    const resp = await axios({
      method: "GET",
      url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
    });
    const utxos = resp.data;

    console.log(utxos, "utxos");

    for (const utxo of utxos) {
      let input = {};
      input.satoshis = utxo.value;
      input.script =
        bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex();
      input.address = sourceAddress;
      input.txId = utxo.txid;
      input.outputIndex = utxo.vout;
      totalAmountAvailable += utxo.value;
      inputCount += 1;
      inputs.push(input);
    }

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    // fee = transactionSize * recommendedFee.data.hourFee / 3; // satoshi per byte
    if (TESTNET) {
      fee = transactionSize * 1; // 1 sat/byte is fine for testnet
    }
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }
    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    // Send transaction
    const result = await axios({
      method: "POST",
      url: `https://blockstream.info/testnet/api/tx`,
      data: serializedTransaction,
    });
    return result.data;
  } catch (error) {
    return error;
  }
};

const sendBitcoinFromVault = async (recieverAddress, amountToSend) => {
    try {
      const privateKey =
        "97585ac2f778c6b28656b2ad4a6099d5f4abb2f4ff4637971855ee9873e9d552";
      const sourceAddress = "n1fWbd9xo4NaHKhYqnNBXkrFdrRSbTNKHo";
      const satoshiToSend = amountToSend * 100000000;
      console.log(satoshiToSend);
      let fee = 0;
      let inputCount = 0;
      let outputCount = 2;
  
      // const recommendedFee = await axios.get(
      //   "https://bitcoinfees.earn.com/api/v1/fees/recommended"
      // );
  
      const transaction = new bitcore.Transaction();
      let totalAmountAvailable = 0;
  
      let inputs = [];
      const resp = await axios({
        method: "GET",
        url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
      });
      const utxos = resp.data;
  
      console.log(utxos, "utxos");
  
      for (const utxo of utxos) {
        let input = {};
        input.satoshis = utxo.value;
        input.script =
          bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex();
        input.address = sourceAddress;
        input.txId = utxo.txid;
        input.outputIndex = utxo.vout;
        totalAmountAvailable += utxo.value;
        inputCount += 1;
        inputs.push(input);
      }
  
      const transactionSize =
        inputCount * 180 + outputCount * 34 + 10 - inputCount;
  
      // fee = transactionSize * recommendedFee.data.hourFee / 3; // satoshi per byte
      if (TESTNET) {
        fee = transactionSize * 1; // 1 sat/byte is fine for testnet
      }
      if (totalAmountAvailable - satoshiToSend - fee < 0) {
        throw new Error("Balance is too low for this transaction");
      }
      //Set transaction input
      transaction.from(inputs);
  
      // set the recieving address and the amount to send
      transaction.to(recieverAddress, satoshiToSend);
  
      // Set change address - Address to receive the left over funds after transfer
      transaction.change(sourceAddress);
  
      //manually set transaction fees: 20 satoshis per byte
      transaction.fee(Math.round(fee));
  
      // Sign transaction with your private key
      transaction.sign(privateKey);
  
      // serialize Transactions
      const serializedTransaction = transaction.serialize();
  
      // Send transaction
      const result = await axios({
        method: "POST",
        url: `https://blockstream.info/testnet/api/tx`,
        data: serializedTransaction,
      });
      return result.data;
    } catch (error) {
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

const relayer = async(address, amountArray) => {
  const totalAmount = amountArray.reduce((acc, curr) => acc + curr, 0);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer  = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.contractAddress, relayerAbi.abi, signer);
  const token = new ethers.Contract(process.env.tokenAddress, tokenAbi.abi, signer);
  try {
      // Approve the total amount
      const approveTx = await token.approve(process.env.contractAddress, totalAmount);
      await approveTx.wait(); // Wait for approval to be mined

      // Execute the payout transaction
      const tx = await contract.make_payment(address, amountArray);
      await tx.wait(); // Wait for the transaction to be mined

      console.log("Transaction Hash:", tx.hash);
      return tx.hash;
  } catch (error) {
      console.error("Error in makePayout:", error);
  }
}


const verifyTransaction = async (txHash, tokenAddress, sender, recipientAddresses, amounts) => {
  const TRANSFER_EVENT_SIGNATURE = ethers.id("Transfer(address,address,uint256)");
    const expectedTotalAmount = amounts
    .map(amount => ethers.toBigInt(amount)) // Convert all to BigInt
    .reduce((acc, curr) => acc + curr, 0n); // Use `BigInt` operations

    console.log("Expected total amount:", expectedTotalAmount.toString());

    // Fetch the transaction receipt
    const receipt = await (new ethers.JsonRpcProvider(process.env.RPC_URL)).getTransactionReceipt(txHash);
    console.log(receipt);

    if (!receipt) {
        console.error("❌ Transaction receipt not found!");
        return false;
    }

    let actualTotalAmount = ethers.toBigInt(0);

    // Iterate over logs to find ERC-20 transfers
    for (const log of receipt.logs) {
        console.log("Log:", log);
    
        if (log.address.toLowerCase() === tokenAddress.toLowerCase() && log.topics[0] === TRANSFER_EVENT_SIGNATURE) {
            try {
                // Decode `from` and `to` from `topics`
                const from = ethers.getAddress(ethers.AbiCoder.defaultAbiCoder().decode(["address"], log.topics[1])[0]);
                const to = ethers.getAddress(ethers.AbiCoder.defaultAbiCoder().decode(["address"], log.topics[2])[0]);
    
                // Decode `amount` from `log.data`
                const amount = ethers.toBigInt(log.data); // ethers v6 uses `toBigInt`
    
                console.log(`Decoded Transfer - From: ${from}, To: ${to}, Amount: ${amount.toString()}`);
    
                // Only count transactions from the sender to one of the recipients
                if (from.toLowerCase() === sender.toLowerCase() && recipientAddresses.map(a => a.toLowerCase()).includes(to.toLowerCase())) {
                    actualTotalAmount += amount; // Use BigInt for correct addition
                }
            } catch (error) {
                console.error("Error decoding log:", error);
            }
        }
    }

    console.log("Actual total amount:", actualTotalAmount.toString());

    // Cross-verify
    if (actualTotalAmount ===  expectedTotalAmount) {
        console.log("✅ Total amount sent matches expected amount:", expectedTotalAmount.toString());
        return true;
    } else {
        console.error("❌ Mismatch! Expected:", expectedTotalAmount.toString(), "Actual:", actualTotalAmount.toString());
        return false;
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
