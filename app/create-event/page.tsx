'use client';

import { useWeb3 } from "@/context/Web3Context";
import MintTicketForm from "../components/EventForm";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import ShareToX from "../components/ShareToX";
const Page = () => {
  const router = useRouter();
  const { address, isConnected, isAdmin, connectWallet } = useWeb3();
  console.log("Web3 Context:", { address, isConnected, isAdmin });
  console.log("Admin Wallets:", process.env.NEXT_PUBLIC_ADMIN_WALLETS);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-300/15 to-indigo-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-500 hover:scale-105 border border-white/20">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:rotate-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Connect Your Wallet
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              To create events on Accessly, you need to connect your Web3 wallet first.
              This ensures secure event management on the blockchain.
            </p>

            {/* Connect Button */}
            <button
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 group"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Connect Wallet
              </span>
            </button>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Secure blockchain integration</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>NFT-based ticket management</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Fraud-proof event creation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center relative overflow-hidden py-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-300/15 to-red-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-500 hover:scale-105 border border-white/20 flex flex-col justify-center items-center">
            {/* Icon */}
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl w-12 flex justify-center items-center">
              <Ticket className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mt-3 mb-3">
              Access Restricted
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              You are not authorized to create events on this platform.
              Only verified organizers can create and manage events.
            </p>

            {/* Connected Wallet Info */}
            <div className="bg-gray-50/80 rounded-2xl p-4 mb-6">
              <div className="text-sm text-gray-500 mb-1">Connected Wallet</div>
              <div className="font-mono text-sm text-gray-800 break-all">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-5">
              <button
                onClick={() => {
                  router.push('/events');
                }}
                className=" bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300/50"
              >
                Browse Events
              </button>

              <button
                onClick={() => {
                  router.push('/my-tickets');
                }}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full border-2 border-t-indigo-600 border-purple-600 border-b-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
              >
                View My Tickets
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl">
              <p className="text-sm text-gray-600 mb-2">
                Want to become an event organizer?
              </p>
              <a
                href="mailto:ghategunjan@gmail.com"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                Contact our team →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/5 via-blue-600/10 to-blue-600/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-blue-400/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <MintTicketForm />
                      {/* <ShareToX
                title="🎉 New Event Created on Accessly!"
                content="Join us at the 'Accessly Launch Event' on June 25 in Bangalore. Mint your ticket now and be part of the future of decentralized ticketing!"
                hashtags={["Accessly", "NFTtickets", "Web3", "ProofOfAttendance"]}
                url="https://accessly-self.vercel.app/events"
              /> */}
      </div>
    </div>
  );
};

export default Page;