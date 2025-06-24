"use client"
import * as React from 'react';
import { Ticket, Menu, X } from 'lucide-react';
import WalletButton from './WalletButton';
import * as framerMotion from 'framer-motion';
const motion = framerMotion.motion;
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm z-[100]"
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
            <div>
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

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link href="/events" className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              Events
            </Link>
            <Link href="/your-tickets" className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              Your Tickets
            </Link>
            <Link href={"/create-event"} className="text-gray-800 hover:text-indigo-600 font-medium hover:underline hover:decoration-violet-500 text-lg transition-all duration-500">
              Create Event
            </Link>
          </motion.nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
            <button
              aria-label="Open Menu"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>

            {/* Wallet Button (Always visible) */}
            <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className=""
            >
            <WalletButton />
            </motion.div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileNavOpen && (
            <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="md:hidden flex flex-col space-y-2 mt-2 pb-4"
            >
            <Link href="/events" className="text-gray-800 hover:text-indigo-600 font-medium text-base px-2 py-1" onClick={() => setMobileNavOpen(false)}>
              Events
            </Link>
            <Link href="/your-tickets" className="text-gray-800 hover:text-indigo-600 font-medium text-base px-2 py-1" onClick={() => setMobileNavOpen(false)}>
              Your Tickets
            </Link>
            <Link href="/create-event" className="text-gray-800 hover:text-indigo-600 font-medium text-base px-2 py-1" onClick={() => setMobileNavOpen(false)}>
              Create Event
            </Link>
            </motion.nav>
          )}
      </header>
    </motion.div>
  );
};

export default Header;