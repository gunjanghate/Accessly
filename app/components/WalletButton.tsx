'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react';
import { connectWallet, getBalance } from '@/lib/wallet';
import { useRouter } from 'next/navigation';
const ADDRESS_KEY = 'wallet_address';

export default function WalletButton() {
    const router = useRouter();
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Load address from localStorage on mount
    useEffect(() => {
        const storedAddress = typeof window !== 'undefined' ? localStorage.getItem(ADDRESS_KEY) : null;
        if (storedAddress) {
            setAddress(storedAddress);
            getBalance(storedAddress).then(setBalance);
        }
    }, []);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const result = await connectWallet();
            if (result) {
                setAddress(result.address);
                localStorage.setItem(ADDRESS_KEY, result.address);
                const bal = await getBalance(result.address);
                setBalance(bal);
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        setAddress(null);
        setBalance(null);
        localStorage.removeItem(ADDRESS_KEY);
        setIsDropdownOpen(false);
    };

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

    // If not connected, show connect button
    if (!address) {
        return (
            <motion.button
                onClick={handleConnect}
                disabled={isConnecting}
                className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex items-center space-x-2">
                    {isConnecting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <Wallet className="w-4 h-4" />
                            <span>Connect Wallet</span>
                        </>
                    )}
                </div>
            </motion.button>
        );
    }

    // If connected, show wallet info with dropdown
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
                        {balance && (
                            <p className="text-xs text-gray-500">{balance}</p>
                        )}
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
                            <button onClick={() => {
                                router.push("/my-events")
                            }
                            }
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
                            >

                                Your Events
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
                                    <p className="text-xs text-gray-500 font-mono">{address}</p>
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
                                    onClick={handleDisconnect}
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

            {/* Backdrop to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
}