 MVP (Minimum Viable Product) is Ready! 🚀
# 🎟️ Accessly – Decentralized Event Ticketing DApp

Accessly is a modern Web3-native ticketing platform that empowers users to create, buy, and verify event tickets using blockchain technology. By minting tickets as NFTs, Accessly brings **transparency**, **ownership**, and **trust** into the event ticketing ecosystem.

---

## 🚨 Problem It Solves

Current Web2 ticketing platforms suffer from:
- ❌ Fake and duplicate tickets
- ❌ Lack of transparency in resale/ownership
- ❌ Centralized control of data and payments
- ❌ No live tracking of ticket use

---

## ✅ My Web3 Solution

Accessly ensures:
- ✅ Tickets minted as **NFTs** (ERC721 or ERC1155)
- ✅ QR-based **on-chain ownership verification**
- ✅ Resale and **ownership traceability**
- ✅ Metadata stored on **IPFS/Filecoin**
- ✅ Transparent and secure purchase flows using **crypto wallets**

---

## 🧱 Tech Stack

| Layer       | Tech                                    |
|------------|------------------------------------------|
| Framework  | [Next.js 15 (App Router)](https://nextjs.org) |
| Styling    | Tailwind CSS, Framer Motion              |
| Wallets    | Ethers.js            |
| Storage    | IPFS/Filecoin (via Pinata)          |
| Blockchain | Solidity (Hardhat), Filecoin testnet      |
| UI Tools   | Shadcn UI, Lucide Icons                  |
| Hosting    | Vercel                                   |

---

## 📦 Features

- 🎨 NFT ticket minting with event metadata
- 💼 Wallet connect + balance check
- 📄 Ticket metadata hosted on IPFS
- 💳 Buy tickets with MetaMask
- 🔄 Transfer & resale support (future module)
- 📲 QR code-based entry verification
- 📊 User & Organizer dashboards
- 🧪 Contract & UI testing
- 🌗 Fully responsive UI + dark mode

---

## 🧪 Modules Breakdown

| # | Module | Description |
|--|--------|-------------|
| 1️⃣ | Project Setup | Next.js 15 + Tailwind CSS + Framer Motion |
| 2️⃣ | Wallet Integration | Ethers js |
| 3️⃣ | Smart Contracts | NFT ticket contract (ERC721) |
| 4️⃣ | Ticket Minting + IPFS | Upload metadata to IPFS & mint NFTs |
| 5️⃣ | Ticket Purchase Flow | Buy tickets using wallet, handle transactions |
| 6️⃣ | QR Code Verification | Scan and verify ticket ownership live |
| 7️⃣ | Ticket Transfer | Enable secondary ticketing & transfer |
| 8️⃣ | User Dashboard | View past/future/resold tickets |
| 9️⃣ | Admin Panel | Organizer dashboard to create/manage events |
| 🔟 | UI/UX Polish | Responsive design, animation, skeletons |
| 1️⃣1️⃣ | Testing & Deployment | Hardhat (contract) , Vercel (app) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/gunjanghate/Accessly.git
cd Accessly
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file and configure:

```
NEXT_PUBLIC_PROJECT_ID=<walletconnect_or_infura_id>
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_ticket_contract_address>
NEXT_PUBLIC_IPFS_GATEWAY=https://your-ipfs-gateway
MONGODB_URI=your-mongodb-uri
NEXT_PUBLIC_ADMIN_WALLETS="admin wallet addresses"
```

### 4. Run the Dev Server

```bash
npm run dev
```

---

## 🔐 Smart Contracts

* **TicketNFT.sol** – ERC721 contract to mint event tickets as NFTs
* Deployed to: Filecoin Testnet (for now)
* Interacts with the frontend using **Ethers v6**

> Contract includes: `eventName`, `date`, `location`, `seat`, and `price` stored as metadata and mapped to tokenId.

---

## 🧠 Bonus Features (Planned)

* 🔗 ENS name resolution
* 🧠 AI-based ticket pricing recommendations
* 🎫 NFT-gated event creation
* 🌍 Community-driven event discovery

---

## 💡 Contributing

Pull requests are welcome! If you want to contribute to a module, please fork the repo and submit a PR.

---


## 🙌 Acknowledgments

Thanks to:

* OpenZeppelin Contracts
* Pinata
* Framer Motion
* Shadcn UI

---

## 📬 Contact

Made with ❤️ by [@gunjanghate](https://github.com/gunjanghate)
Open to contributions, feedback, and collaboration!

```

