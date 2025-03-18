const express = require("express");
const router = express.Router();
const {
  getAllUtxos,
  sendBitcoin,
  createWallet,
  sendBitcoinFromVault,
} = require("../services");

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

router.post("/claim-solver", async (req, res) => {
  const { recieverAddress, txhash } = req.body;
  // check for txHash on core metadata after // task 
  const transaction = await sendBitcoinFromVault(recieverAddress, amountToSend);
});

router.post("/create-wallet", async (req, res) => {
  try {
    let result = await createWallet(testnet);
    res.json({ success: true, result });
  } catch (error) {}
});

module.exports = router;
