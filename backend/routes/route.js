const express = require("express");
const router = express.Router();
const {
  getAllUtxos,
  sendBitcoin,
  createWallet,
  sendBitcoinFromVault,
  relayer,
  verifyTransaction,
} = require("../utils/controller");

const {ethers} = require("ethers");

const tokenAbi = require("../public/token.json");
const relayerAbi = require("../public/relayer.json");

router.get("/utxos/:address", async (req, res) => {
  try {
    const utxo = await getAllUtxos(req.params.address);
    res.json({ success: true, utxo });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// POST /wallet/transaction - Create a Bitcoin transaction
router.post("/sendbtc", async (req, res) => {
  try {
    const { recieverAddress, amountToSend } = req.body;
    if (!recieverAddress || !amountToSend) {
      return res
        .status(400)
        .json({ success: false, error: "Missing parameters" });
    }
    const transaction = await sendBitcoin(recieverAddress, amountToSend);
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.post("/create-wallet", async (req, res) => {
  try {
    let result = await createWallet(testnet);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

// route to make payout : evm side 
router.post("/make-payout", async (req, res) => {
  const {addressArray, amountArray} = req.body;

  // call make payout function
  const txHash = await relayer(addressArray, amountArray);
  const verify = await verifyTransaction(txHash, process.env.tokenAddress, process.env.ADDRESS, addressArray, amountArray);

  if(verify){
    const transaction = await sendBitcoinFromVault(recieverAddress, amountToSend);
    console.log("Transaction Hash:", transaction);
    res.json({ success: true, transaction });
  }else{
    res.status(400).json({ success: false, error: "Transaction not verified" });
  }
});

module.exports = router;
