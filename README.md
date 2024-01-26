# Solana Auto-Transfer

This JavaScript script utilizes the Solana Web3.js library to automate the periodic transfer of Solana (SOL) cryptocurrency from one wallet (using its PRIVATE_KEY) to another (RECIPIENT_ADDRESS).
The script continuously monitors the balance of a source wallet (using its PRIVATE_KEY) and initiates transfers to a specified RECIPIENT_ADDRESS when sufficient funds are available or transferred to the Host wallet (using its PRIVATE_KEY).

## Features:

- **Automated Transfers:** The script periodically checks the balance of a source wallet and transfers available funds to a recipient wallet on the Solana blockchain.

* **Balance Monitoring:** Provides real-time information about the balances of both the source and recipient wallets during the transfer process.

- **Configurable Parameters:** Easily configurable with environment variables, including private key and recipient address, allowing for seamless integration into various Solana development environments.

## Usage:

1. Set up a '**.env**' file with the required environment variables (PRIVATE_KEY, RECIPIENT_ADDRESS).
2. Run the script to initiate automated transfers.

## Prerequisites:

- `nodejs`
- `ts-node`
- `@solana/web3.js`
- `@solana/spl-token`
- `bs58`

## ENV file for Solana transfer:

**Make sure to replace the PRIVATE_KEY and RECIPIENT_ADDRESS values with your own private key and recipient address.**

```
PRIVATE_KEY = "42a0deed1bf2e2c7d748d4c389a44cb9***************8404ecbd76c840e"
RECIPIENT_ADDRESS = "4a5f69c2c84c3839e5e7a60f0a30a34a57c61a7199a06557b19a82b67144bf8f"
```

## How to Run Solana AutoTransfer:

```
npm install
```

or

```
yarn install
```

```
node auto-Transfer.js
```

## ENV file for auto SPL-Token transfer:

**Make sure to replace the PRIVATE_KEY, RECIPIENT_ADDRESS and TOKEN_MINT values with your own private key, recipient address and token mint.**

```env
PRIVATE_KEY = "42a0deed1bf2e2c7d748d4c389a44cb9***************8404ecbd76c840e"
RECIPIENT_ADDRESS = "4a5f69c2c84c3839e5e7a60f0a30a34a57c61a7199a06557b19a82b67144bf8f"
TOKEN_MINT="9b4Qwtr4NeDjqmD1QeJ2Jj4FTX6eGb9RusXwZyEQvdii"
```

## How to Run Solana Spl-Transfer:

```
npm install
```

or

```
yarn install
```

```
ts-node spl-tokenTransfer.ts
```

## Important Note:

Make sure to handle your private key securely and avoid sharing it publicly. This script is intended for educational and testing purposes.

Feel free to contribute, report issues, or suggest improvements!

Adjust the content as needed, and feel free to add any specific details or instructions relevant to your use case.
