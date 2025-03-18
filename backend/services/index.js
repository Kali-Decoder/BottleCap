const axios = require("axios");
const bitcore = require("bitcore-lib");
const TESTNET = true;
const { PrivateKey } = require("bitcore-lib");

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

module.exports = {
  sendBitcoin,
  getAllUtxos,
  createWallet,
  createHDWallet,
};
