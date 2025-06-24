'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import { useRouter } from 'next/navigation';

export default function WalletButton() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={connectWallet}
        className="relative px-6 py-2.5 border-2 hover:border-purple-700 border-t-indigo-600 border-purple-600 border-b-purple-600 transition-all duration-200 hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-1 md:space-x-2 md:gap-0">
          <Wallet className="w-4 h-4" />
          <span className='text-sm md:text-lg'>Connect Wallet</span>
        </div>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connected</p>
                  <p className="text-sm text-gray-500">Wallet</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Account
              </div>

              <button
                onClick={() => router.push("/your-events")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg  font-semibold text-purple-500 hover:text-purple-800 transition-all duration-200"
              >
              🎪 Your Events
              </button>

              <button
                onClick={copyAddress}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {copied ? 'Copied!' : 'Copy Address'}
                  </p>
                  <p className="text-xs text-gray-500 font-mono"> {address.slice(0, 6)}...{address.slice(-4)}</p>
                </div>
              </button>

              <button
                onClick={openInExplorer}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">View on Explorer</p>
                  <p className="text-xs text-gray-500">Open in block explorer</p>
                </div>
              </button>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    disconnectWallet();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors duration-150 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Disconnect</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}
