const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
// ERC-20 Transfer event signature
const TRANSFER_EVENT_SIGNATURE = ethers.id("Transfer(address,address,uint256)");

const verifyTransaction = async (txHash, tokenAddress, sender, recipientAddresses, amounts) => {
    console.log(process.env.RPC_URL);
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

// verifyTransaction(
//     "0xfd2989d3af9ec8ceeea4bf9d86190dc5453828355cc98e13d81b25229838c249",
//     process.env.tokenAddress,
//     process.env.ADDRESS,
//     ["0xb386170A2717Dbb65C2EeE4062a5Bb097C895a0E", "0xcfa038455b54714821f291814071161c9870B891"],
//     [1,2]
// )


