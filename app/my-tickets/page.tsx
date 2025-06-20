'use client';
import * as React from "react";
// import {  useState } from "react";
// import { ethers } from "ethers";
// import { getTokensByOwner } from "@/lib/getTokensByOwner";
import { motion } from "framer-motion";

const MyTicketPage = () => {
  // const [wallet, setWallet] = useState("");
  // setWallet(wallet)
  // const [loading, setLoading] = useState(true);
  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex flex-col justify-center items-center px-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 bg-clip-text text-transparent">
            {/* Your Tickets ({wallet ? wallet.slice(0, 6) + '...' : 'Loading...'}) */}
            Your Tickets
          </h1>
        </div>
      </motion.div>
                          <motion.div
                              key="empty"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-16"
                          >
                              <div className="text-6xl mb-6">🎫</div>
                              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Tickets Found</h3>
                              <p className="text-gray-600 max-w-md mx-auto">
                                  You do not have any tickets yet. Start exploring events and get your first NFT ticket!
                              </p>
                          </motion.div>

    </div>
  )
}

export default MyTicketPage
