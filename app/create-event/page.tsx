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
    <div className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300/5 via-blue-600/10 to-blue-600/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
      
      <MintTicketForm />
    </div>
  );
};

export default Page;
