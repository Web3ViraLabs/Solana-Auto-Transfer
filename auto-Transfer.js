const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl('devnet'),
  'confirmed'
);

const privateKey = process.env.PRIVATE_KEY;
const recipientAddress = process.env.RECIPIENT_ADDRESS;

if (!privateKey || !recipientAddress) {
  console.error('Missing PRIVATE_KEY or RECIPIENT_ADDRESS in the .env file');
  process.exit(1);
}

const fromWallet = web3.Keypair.fromSecretKey(bs58.decode(privateKey));

const recipientPublicKey = new web3.PublicKey(recipientAddress);

const sol = 1000000000;
const minSolana = 0.003;
const minSolanaLamports = minSolana * sol;

const getBalance = async (publicKey) => {
  const balance = await connection.getBalance(publicKey);
  return balance;
};

const transfer = async (toPublicKey, lamports) => {
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toPublicKey,
      lamports,
    })
  );

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );

  return signature;
};

const clearConsole = () => {
  // Clear console depending on the platform
  console.clear();
};

const printInfo = (message) => {
  clearConsole();
  console.log(message);
};

const transferAllFund = async () => {
  while (true) {
    try {
      const balanceMainWallet = await getBalance(fromWallet.publicKey);
      const balanceLeft = balanceMainWallet - minSolanaLamports;

      if (balanceLeft < 0) {
        printInfo('Not enough balance to transfer');
      } else {
        printInfo('Wallet A balance: ' + balanceMainWallet);

        const signature = await transfer(recipientPublicKey, balanceLeft);

        const balanceOfWalletB = await getBalance(recipientPublicKey);
        console.log('SIGNATURE', signature);
        console.log('Wallet B balance', balanceOfWalletB);
      }

      // Add a delay before the next transfer (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
    } catch (error) {
      printInfo('Error during transfer: ' + error.message);
    }
  }
};

transferAllFund();
