# Intellectual Property Registry – Track Ownership of Ideas

A decentralized, full-stack application built on the **Stellar Soroban** blockchain. This platform allows creators to anchor their intellectual property by storing a unique SHA-256 fingerprint (hash) of their ideas on a public ledger, providing immutable proof of existence and ownership.

## 🚀 Features

-   **Idea Registration**: Convert project details into a SHA-256 hash and record it on Stellar Soroban.
-   **Blockchain Integrity**: Only the hash is stored on-chain, ensuring privacy while maintaining a public record.
-   **Ownership Verification**: Instantly check any hash against the blockchain to retrieve owner details and timestamps.
-   **Global Dashboard**: Real-time feed of all registered intellectual property.
-   **Wallet Integration**: Secure identity management using **Freighter Wallet**.
-   **Duplicate Prevention**: Smart system checks for existing hashes to prevent multi-registration of the same idea.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Tailwind CSS 4, Motion (Animations), Lucide React (Icons).
-   **Backend**: Node.js, Express.js.
-   **Blockchain**: Stellar Soroban (Rust Smart Contract).
-   **Database**: MongoDB (via Mongoose).
-   **Utilities**: `stellar-sdk`, `crypto-js`, `@stellar/freighter-api`.

## 📦 Project Structure

```text
├── backend/            # Integrated within server.ts
├── frontend/           # src/ directory (React)
├── smart-contract/     # Soroban Rust source code
├── server.ts           # Express + Vite Full-stack entry point
└── README.md           # This guide
```

## ⚙️ Setup & Local Execution

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Running locally or a URI)
-   [Freighter Wallet](https://www.freighter.app/) Browser Extension

### Steps
1.  **Clone the project** and navigate to the root directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Update `.env` with your `MONGODB_URI`. If not provided, the app defaults to `mongodb://localhost:27017/ip-registry`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will start at `http://localhost:3000`.

## 🛡️ Stellar Testnet Setup

1.  Open **Freighter Wallet**.
2.  Switch to **Testnet** in the settings.
3.  Fund your account using the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet).
4.  Connect your wallet in the application to start signing registrations.

## 📄 License
SPDX-License-Identifier: Apache-2.0

---
*Note: This project is designed for academic submission and demonstrates the complete integration of blockchain technology with modern web architecture.*
