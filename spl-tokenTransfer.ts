import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import dotenv from "dotenv";
import base58 from "bs58";

dotenv.config();

const MICRO_LAMPORTS_PRIORITY = 100; // Micro Lamports
const COMPUTE_UNIT_LIMIT = 1000000; // CU
const SLEEP_SECONDS = 10; // seconds before trying again
const TRANSFER_ALL = false; // Should all the tokens be transferred
const TRANSFER_AMOUNT = 10000000; // If TRANSFER_ALL is false, the amount of tokens to transfer

const TOKEN_DECIMAL = 9; // Number of decimal places for the token

/**
 * Converts the given amount in lamports to display units
 * @param amountInLamports - The amount in lamports to convert
 * @param decimals - The number of decimal places to use for the display units (default is 9)
 * @returns The amount in display units as a string
 */
function convertLamportsToDisplayUnits(
  amountInLamports: bigint,
  decimals: number = TOKEN_DECIMAL
): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const amountInDisplayUnits = Number(amountInLamports) / Number(divisor);
  return amountInDisplayUnits.toFixed(decimals);
}

async function transferTokens() {
  try {
    const startTime = Date.now();
    const fromWallet = Keypair.fromSecretKey(
      base58.decode(process.env.PRIVATE_KEY!)
    );
    const connection = new Connection(clusterApiUrl("devnet"));
    const mintToken = new PublicKey(process.env.TOKEN_MINT!);
    const toPubKey = new PublicKey(process.env.RECIPIENT_ADDRESS!);
    console.log("Private wallet pubkey: ", fromWallet.publicKey.toString());
    console.log("Mint token : ", mintToken.toString());
    console.log("From account : ", fromWallet.publicKey.toString());
    console.log("To account : ", toPubKey.toString());

    const totalTransferInstructions: TransactionInstruction[] = [];
    const associatedTokenFrom = await getAssociatedTokenAddress(
      mintToken,
      fromWallet.publicKey
    );
    const fromAccount = await getAccount(connection, associatedTokenFrom);
    console.log(
      "Sender account token balance : ",
      convertLamportsToDisplayUnits(fromAccount.amount)
    );

    if (fromAccount.amount <= 0) {
      console.log("Insufficient tokens");
      return;
    }

    const associatedTokenTo = await getAssociatedTokenAddress(
      mintToken,
      toPubKey
    );

    try {
      const toAccount = await getAccount(connection, associatedTokenTo);
      console.log(
        "Receiver account token balance : ",
        convertLamportsToDisplayUnits(toAccount.amount)
      );
    } catch (error) {}

    if (!(await connection.getAccountInfo(associatedTokenTo))) {
      console.log(
        "The ATA does not exist for receiver, creating one: ",
        JSON.stringify(associatedTokenTo, null, 2)
      );
      totalTransferInstructions.push(
        createAssociatedTokenAccountInstruction(
          fromWallet.publicKey,
          associatedTokenTo,
          toPubKey,
          mintToken
        )
      );
    }

    totalTransferInstructions.push(
      createTransferInstruction(
        fromAccount.address,
        associatedTokenTo,
        fromWallet.publicKey,
        !TRANSFER_ALL ? TRANSFER_AMOUNT : fromAccount.amount
      )
    );

    const priority = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: MICRO_LAMPORTS_PRIORITY,
    });

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: COMPUTE_UNIT_LIMIT,
    });

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction();
    transaction.feePayer = fromWallet.publicKey;
    const txUnits = transaction.add(modifyComputeUnits);
    const txBase = transaction.add(...totalTransferInstructions);
    const txPriority = transaction.add(priority);
    txUnits.recentBlockhash = blockhash.blockhash;
    txBase.recentBlockhash = blockhash.blockhash;
    txPriority.recentBlockhash = blockhash.blockhash;
    txBase.lastValidBlockHeight = blockhash.lastValidBlockHeight;
    txPriority.lastValidBlockHeight = blockhash.lastValidBlockHeight;
    txUnits.lastValidBlockHeight = blockhash.lastValidBlockHeight;

    console.log(
      "\x1b[33m%s\x1b[0m",
      "Transaction Instructions -> ",
      JSON.stringify(transaction, null, 1)
    );

    console.log(
      "\x1b[31m",
      "Estimated transaction fees: ",
      await transaction.getEstimatedFee(connection),
      " Lamports",
      "\x1b[0m"
    );

    console.log(
      "\x1b[32m",
      `Sending ${convertLamportsToDisplayUnits(
        fromAccount.amount
      )} tokens from ${fromWallet.publicKey.toBase58()} to ${toPubKey.toBase58()}`,
      "\x1b[0m"
    );

    const [txBaseRequest, txPriorityRequest] = [txBase, txPriority].map((tx) =>
      sendAndConfirmTransaction(connection, tx, [fromWallet])
    );

    const [txBaseId, txPriorityId] = await Promise.all([
      txBaseRequest,
      txPriorityRequest,
    ]);

    const [txBaseResult, txPriorityResult] = await Promise.all([
      connection.getParsedTransaction(txBaseId, {
        maxSupportedTransactionVersion: 0,
      }),
      connection.getParsedTransaction(txPriorityId, {
        maxSupportedTransactionVersion: 0,
      }),
    ]);
    console.log(
      `Token Transfer URL: https://solscan.io/tx/${txBaseId}?cluster=devnet`
    );
    console.log(
      `Priority URL: https://solscan.io/tx/${txPriorityId}?cluster=devnet`
    );
    console.log(`Token Transfer Fee: ${txBaseResult?.meta?.fee} Lamports`);
    console.log(`Priority Fee: ${txPriorityResult?.meta?.fee} Lamports`);
    const endTime = Date.now();
    console.log("Total time taken: ", endTime - startTime, "ms");
    return;
  } catch (error) {
    console.log("[transferTokens] ", error);
    throw error;
  }
}

const polForTransfer = async () => {
  while (true) {
    try {
      await transferTokens();
      console.log(`Waiting ${SLEEP_SECONDS} seconds to transfer again...`);

      await new Promise((resolve) => setTimeout(resolve, SLEEP_SECONDS * 1000));
    } catch (error: any) {
      console.log("Error during transfer: " + error.message);
    }
  }
};

polForTransfer();
