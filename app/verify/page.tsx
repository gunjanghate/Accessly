'use client';

import { useState, useEffect, Suspense } from 'react';
import { getTicketContract } from '@/lib/contract';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {motion} from 'framer-motion';

type Ticket = {
    tokenURI: string;
    isClaimed: boolean;
};

type TicketMetadata = {
    name: string;
    image: string;
};

type TicketData = Ticket & {
    owner: string;
    metadata: TicketMetadata;
};

function VerifyTicketContent() {
    const [tokenId, setTokenId] = useState('');
    const [ticketData, setTicketData] = useState<TicketData | null>(null);
    const [status, setStatus] = useState('');
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const urlTokenId = searchParams.get('tokenId');
        if (urlTokenId) {
            setTokenId(urlTokenId);
            handleVerify(urlTokenId);
        }
        // eslint-disable-next-line
    }, [searchParams]);

    const handleVerify = async (id?: string) => {
        setIsLoading(true);
        setStatus('Verifying...');
        try {
            const tokenToVerify = id ?? tokenId;
            if (!tokenToVerify) {
                setStatus('❌ Please enter a Token ID.');
                setIsLoading(false);
                return;
            }
            if (!window.ethereum) {
                setStatus('❌ Ethereum provider not found. Please install MetaMask.');
                setIsLoading(false);
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum as unknown as ethers.Eip1193Provider);
            const contract = getTicketContract(provider);

            const owner: string = await contract.ownerOf(Number(tokenToVerify));

            const res = await fetch(`/api/tickets/by-token/${tokenToVerify}`);
            if (!res.ok) throw new Error('Ticket not found');
            const ticket: Ticket = await res.json();

            const metaRes = await fetch(ticket.tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
            const metadata: TicketMetadata = await metaRes.json();

            setTicketData({ owner, metadata, ...ticket });
            setIsClaimed(ticket.isClaimed);

            if (ticket.isClaimed) {
                setStatus('❌ Already Used');
            } else {
                await handleClaim(tokenToVerify);
            }
        } catch (err) {
            console.error(err);
            setStatus(`❌ ${(err as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (id?: string) => {
        try {
            const claimTokenId = id ?? tokenId;
            const res = await fetch(`/api/tickets/${claimTokenId}/claim`, {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error('Failed to update claim status');
            setIsClaimed(true);
            setStatus('✅ Entry Allowed');
        } catch (err) {
            setStatus(`❌ ${(err as Error).message}`);
        }
    };

    const getStatusColor = () => {
        if (status.includes('✅')) return 'text-green-600 bg-green-50 border-green-200';
        if (status.includes('❌')) return 'text-red-600 bg-red-50 border-red-200';
        if (status.includes('🟡')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    };

    const getStatusIcon = () => {
        if (status.includes('✅')) return '🎉';
        if (status.includes('❌')) return '⚠️';
        if (status.includes('🟡')) return '⏳';
        return '🔍';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative">
            {/* Header */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300/5 via-blue-600/10 to-blue-600/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
            <div className="backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <motion.span
                                className="text-white font-bold text-4xl"
                                animate={{ rotate: [ -15, 15, -15 ] }}
                                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                            >
                                🎫
                            </motion.span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Ticket Verification
                            </h1>
                            <p className="text-gray-600 text-sm">Secure NFT ticket validation</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Status Card */}
                {status && (
                    <div className={`mb-8 p-6 rounded-2xl border-2  ${getStatusColor()} transition-all duration-300`}>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{getStatusIcon()}</div>
                            <div>
                                <h3 className="font-bold text-lg">Verification Status</h3>
                                <p className="font-semibold text-xl mt-1">{status}</p>
                                {isLoading && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm opacity-75">Processing...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Token ID Display */}
                {tokenId && (
                    <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 hover:border-purple-700 border-t-indigo-600 border-purple-600 border-b-purple-600 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Token ID</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-1">
                                    #{tokenId}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl">🔢</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ticket Details */}
                {ticketData && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-purple-200 shadow-xl overflow-hidden">
                        {/* Ticket Image */}
                        {ticketData.metadata?.image && ticketData.metadata.image !== '' && (
                            <div className="relative h-64 bg-gradient-to-r from-purple-400 to-indigo-500">
                                <Image
                                    src={ticketData.metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                    alt="Ticket Image"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-4 left-6 text-white">
                                    <h2 className="text-3xl font-bold mb-2">{ticketData.metadata.name}</h2>
                                </div>
                            </div>
                        )}

                        {/* Ticket Info */}
                        <div className="p-8">
                            {!ticketData.metadata?.image && (
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                                    {ticketData.metadata.name}
                                </h2>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Owner Info */}
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600">👤</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">Owner</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded-lg border">
                                        {ticketData.owner.slice(0, 6) + '.....' + ticketData.owner.slice(-4)}
                                    </p>
                                </div>

                                {/* Status Info */}
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <span className="text-indigo-600">📋</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">Current Status</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {isClaimed ? '✅' : '🟡'}
                                        </span>
                                        <span className="font-semibold">
                                            {isClaimed ? 'Entry Allowed' : 'Not Claimed'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">✓</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-green-800">Verified NFT Ticket</p>
                                        <p className="text-sm text-green-600">Blockchain authenticated</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {!ticketData && !status && tokenId && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading ticket information...</p>
                    </div>
                )}

                {/* No Token ID State */}
                {!tokenId && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🎫</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Token ID Provided</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Please access this page with a valid token ID parameter to verify your NFT ticket.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyTicketPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading verification system...</p>
                </div>
            </div>
        }>
            <VerifyTicketContent />
        </Suspense>
    );
}