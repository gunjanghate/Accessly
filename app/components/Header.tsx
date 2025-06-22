"use client"
import * as React from 'react';
import { Ticket } from 'lucide-react';
import WalletButton from './WalletButton';
import * as framerMotion from 'framer-motion';
const motion = framerMotion.motion;
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const Header = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm"
    >
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div className=''>
              <h1
                onClick={() => {
                  router.push("/")
                }}
                className="text-2xl font-semibold font-serif bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic cursor-pointer">
                Accessly
              </h1>
              <p className="text-xs text-gray-500">NFT Ticketing</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link href="/events" className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              Events
            </Link>
            <Link href="/my-tickets" className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              My Tickets
            </Link>
            <Link href={"/create-event"} className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              Create Event
            </Link>
          </motion.nav>

          {/* Wallet Button */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <WalletButton />
          </motion.div>
        </div>
      </header>
    </motion.div>
  );
};

export default Header;