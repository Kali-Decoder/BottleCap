const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();


const tokenAbi = require("../public/token.json");
const relayerAbi = require("../public/relayer.json");

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
        
        console.log("Approved the total amount:", totalAmount.toString());
        console.log("Approved at:", approveTx);

        // Execute the payout transaction
        const tx = await contract.make_payment(address, amountArray);
        await tx.wait(); // Wait for the transaction to be mined
  
        console.log("Transaction Hash:", tx.hash);
        return tx.hash;
    } catch (error) {
        console.error("Error in makePayout:", error);
    }
  }

relayer(
    ["0xb386170A2717Dbb65C2EeE4062a5Bb097C895a0E", "0xcfa038455b54714821f291814071161c9870B891"],
    [1,2]
);