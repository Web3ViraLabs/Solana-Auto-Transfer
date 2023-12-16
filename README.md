# Solana Auto-Transfer

This JavaScript script utilizes the Solana Web3.js library to automate the periodic transfer of Solana (SOL) cryptocurrency from one wallet (using its PRIVATE_KEY) to another (RECIPIENT_ADDRESS). 
The script continuously monitors the balance of a source wallet (using its PRIVATE_KEY) and initiates transfers to a specified RECIPIENT_ADDRESS when sufficient funds are available or transferred to the Host wallet (using its PRIVATE_KEY).

## Features:

- **Automated Transfers:** The script periodically checks the balance of a source wallet and transfers available funds to a recipient wallet on the Solana blockchain.
* **Balance Monitoring:** Provides real-time information about the balances of both the source and recipient wallets during the transfer process.
+ **Configurable Parameters:** Easily configurable with environment variables, including private key and recipient address, allowing for seamless integration into various Solana development environments.

## Usage:

1. Set up a '**.env**' file with the required environment variables (PRIVATE_KEY, RECIPIENT_ADDRESS).
2. Run the script to initiate automated transfers.

## Prerequisites:

- Node.js
* Solana Web3.js library

## env file:

````
PRIVATE_KEY = your Wallet Private key
RECIPIENT_ADDRESS = your recipient address
````

## How to Run:

````
npm install
````
````
node auto-Transfer.js
````

## Important Note:

Make sure to handle your private key securely and avoid sharing it publicly. This script is intended for educational and testing purposes.

Feel free to contribute, report issues, or suggest improvements!

Adjust the content as needed, and feel free to add any specific details or instructions relevant to your use case.
