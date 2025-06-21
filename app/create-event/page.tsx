'use client';

import { useWeb3 } from "@/context/Web3Context";
import MintTicketForm from "../components/EventForm";


const Page = () => {
  const { address, isConnected, isAdmin, connectWallet } = useWeb3();
  console.log("Web3 Context:", { address, isConnected, isAdmin });
  console.log("Admin Wallets:", process.env.NEXT_PUBLIC_ADMIN_WALLETS);

  if (!isConnected) {
    return (
      <div className="p-6">
        <p className="mb-4">🔌 Connect wallet to continue...</p>
        <button
          onClick={connectWallet}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-600">
        ❌ You are not authorized to create events.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Create New Event</h1>
      <MintTicketForm />
    </div>
  );
};

export default Page;
