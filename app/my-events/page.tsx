'use client';
import * as React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getTokensByOwner } from "@/lib/getTokensByOwner";
import { motion, AnimatePresence } from "framer-motion";
export default function ProfilePage() {
    const [wallet, setWallet] = useState("");
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!window.ethereum) return;
            
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWallet(address);

            const tokens = await getTokensByOwner(address, provider);
            const ticketData = await Promise.all(tokens.map(async (t) => {
                try {
                    const uri = t.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                    const res = await fetch(uri);
                    const contentType = res.headers.get("content-type");

                    if (!contentType?.includes("application/json")) {
                        console.warn(`Skipping tokenId ${t.tokenId} - not JSON`);
                        return null;
                    }

                    const meta = await res.json();
                    return { tokenId: t.tokenId, tokenURI: t.tokenURI, meta } as TicketType;
                } catch (err) {
                    console.warn(`Skipping tokenId ${t.tokenId} - error fetching metadata`, err);
                    return null;
                }
            }));

            setTickets(ticketData.filter((t): t is TicketType => t !== null));
            setLoading(false);
        };

        load();
    }, []);

    const TicketSkeleton = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden w-96"
        >
            <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
                <div className="animate-pulse space-y-4">
                    <div className="bg-gradient-to-r from-purple-200/50 to-purple-200/50 rounded-xl h-48 w-full"></div>
                    <div className="space-y-3">
                        <div className="bg-gradient-to-r from-purple-200/50 to-purple-200/50 h-6 rounded-lg w-3/4"></div>
                        <div className="bg-gradient-to-r from-purple-200/50 to-purple-200/50 h-4 rounded w-full"></div>
                        <div className="bg-gradient-to-r from-purple-200/50 to-purple-200/50 h-4 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    type TicketType = {
        tokenId: string | number;
        tokenURI: string;
        meta: {
            name: string;
            description: string;
            image?: string;
            attributes?: Array<{
                trait_type: string;
                value: string;
            }>;
        };
    };

    const TicketCard = ({ ticket, index }: { ticket: TicketType; index: number }) => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "easeOut"
                }}
                whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                }}
                className="group relative overflow-hidden cursor-pointer rounded-2xl"
            >
                {/* Glowing background effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-purple-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                    
                    {/* Decorative top gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-500 to-purple-500"></div>
                    
                    <div className="p-6">
                        {/* Image container */}
                        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-50">
                            {!imageError ? (
                                <>
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-purple-200/50 animate-pulse rounded-xl"></div>
                                    )}
                                    <motion.img
                                        src={ticket.meta.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                        alt={ticket.meta.name}
                                        className={`w-full h-48 object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageError(true)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-100 flex items-center justify-center">
                                    <div className="text-center text-purple-400">
                                        <div className="text-4xl mb-2">🎫</div>
                                        <div className="text-sm font-medium">Event Ticket</div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            {/* Title */}
                            <motion.h2
                                className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2"
                                whileHover={{ x: 2 }}
                            >
                                {ticket.meta.name}
                            </motion.h2>
                            
                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                                {ticket.meta.description}
                            </p>

                            {/* Bottom section */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                {/* Token ID Badge */}
                                <motion.div
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                                    whileHover={{ 
                                        scale: 1.05,
                                        boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div 
                                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-400 rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    ></motion.div>
                                    Token #{ticket.tokenId}
                                </motion.div>
                                
                                {/* Ticket icon */}
                                <motion.div
                                    className="text-2xl filter grayscale-0 group-hover:filter-none"
                                    whileHover={{ 
                                        scale: 1.2, 
                                        rotate: [0, -10, 10, 0],
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    🎫
                                </motion.div>
                            </div>

                            {/* Additional metadata if available */}
                            {ticket.meta.attributes && ticket.meta.attributes.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="pt-4 border-t border-gray-100/50"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        {ticket.meta.attributes.slice(0, 2).map((attr, i) => (
                                            <motion.div
                                                key={i}
                                                className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-100/50"
                                                whileHover={{ 
                                                    scale: 1.02,
                                                    backgroundColor: "rgba(147, 51, 234, 0.05)"
                                                }}
                                            >
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                    {attr.trait_type}
                                                </div>
                                                <div className="text-sm font-bold text-gray-800 truncate">
                                                    {attr.value}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex flex-col justify-center items-center px-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-4">
              
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 bg-clip-text text-transparent">
                        Your Events ({wallet ? wallet.slice(0, 6) + '...' : 'Loading...'})
                    </h1>
                </div>
            </motion.div>

            {/* Tickets Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[1, 2, 3].map((i) => (
                            <TicketSkeleton key={i} />
                        ))}
                    </motion.div>
                ) : tickets.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-6">🎫</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">No Events Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            You have not listed any events yet. Start by listing your first event!
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="tickets"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {tickets.map((ticket, index) => {
                            if (!ticket || !ticket.meta) return null;
                            return (
                                <TicketCard 
                                    key={ticket.tokenId} 
                                    ticket={ticket} 
                                    index={index}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}