# cNFT Minting Application

This application allows you to create and mint Compressed NFTs (cNFTs) on the Solana blockchain. You can create a collection of your own profile picture and social links as metadata, and airdrop it to others.

## Table of Contents

- [Description](#description)
- [Building the App](#building-the-app)
- [Instructions](#instructions)
  - [1. Ensure Wallet Connection](#1-ensure-wallet-connection)
  - [2. Create or Set a Merkle Tree](#2-create-or-set-a-merkle-tree)
  - [3. Create or Set a Collection NFT](#3-create-or-set-a-collection-nft)
  - [4. Mint Compressed NFTs (cNFTs)](#4-mint-compressed-nfts-cnfts)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)
- [Contact](#contact)

## Description

Create a cNFT collection of your own profile picture and social links as metadata, and airdrop it to other fellows. The solution involves creating a collection NFT, minting cNFTs from it, and distributing them.

## Building the App

1. **Create a `.env` file** based on the provided template.

2. **Install Dependencies**:
   ```bash
   bun i
   ```

3. **Run the Development Server**:
   ```bash
   bun dev
   ```

## Instructions

### 1. Ensure Wallet Connection

- Connect your Solana wallet to the app.
- You may need SOL for transaction fees. If required, airdrop SOL to your wallet (Devnet only).

### 2. Create or Set a Merkle Tree

1. **Merkle Tree Setup**:
   - Create a Merkle tree or use an existing one.
   - Use the provided calculator to compute Merkle tree parameters if creating a new one.

### 3. Create or Set a Collection NFT

1. **Upload Collection Image**:
   - Use the image uploader to upload an image to Arweave.
   - Set the MIME type or provide an existing image URL and MIME type.

2. **Upload Collection Metadata**:
   - Use the Metadata uploader to upload the metadata file.
   - Alternatively, provide an existing metadata URL.

3. **Set Collection Details**:
   - Enter the collection name (required) and symbol (optional).

### 4. Mint Compressed NFTs (cNFTs)

1. **Upload cNFT Image**:
   - Use the image uploader to upload an image to Arweave for the cNFT.
   - Set the MIME type or provide an existing image URL and MIME type.

2. **Upload cNFT Metadata**:
   - Upload the metadata file using the Metadata uploader.
   - Alternatively, provide an existing metadata URL.

3. **Verify Addresses and Details**:
   - Ensure the Merkle tree and collection NFT addresses are set.
   - Confirm the name, symbol, and list of addresses are accurate.

4. **Minting Process**:
   - Enter the name and symbol for the cNFT.
   - Provide a list of comma-separated addresses for minting.

5. **Mint cNFTs**:
   - Click the "Mint NFTs" button to start the minting process.

## Troubleshooting

- **Invalid Addresses**: Ensure that the provided addresses are valid Solana public keys.
- **Missing Metadata**: Verify that all required metadata is uploaded and URLs are correctly set.
- **Transaction Issues**: Ensure sufficient SOL is available for transaction fees and check network status.

## Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Arweave Documentation](https://www.arweave.org/docs/)
- [Merkle Tree Calculator](#)