'use client';

import { useWeb3 } from '@/context/Web3Context';
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';

const EventDashboard = ({ params }: { params: Promise<{ eventId: string }> }) => {
    const { address, isConnected } = useWeb3();

    const [event, setEvent] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        const fetchEventAndTickets = async () => {
            try {
                console.log('Fetching params...');
                const { eventId } = await params;
                console.log('Fetched eventId:', eventId);

                const res = await fetch(`/api/events/${eventId}`);
                console.log('Fetched event data response:', res);
                const data = await res.json();
                console.log('Event data:', data);

                // 🛑 Check if user is event creator
                if (data.organizerWallet.toLowerCase() !== address.toLowerCase()) {
                    console.log('Unauthorized: user is not the event organizer');
                    setUnauthorized(true);
                    setLoading(false);
                    return;
                }

                setEvent(data);
                console.log('Set event state:', data);

                const ticketsRes = await fetch(`/api/tickets?eventId=${eventId}`);
                console.log('Fetched tickets response:', ticketsRes);
                const ticketData = await ticketsRes.json();
                console.log('Ticket data:', ticketData);

                setTickets(ticketData);
                setLoading(false);
                console.log('Set tickets state and loading false');
            } catch (err) {
                console.error('Error loading dashboard:', err);
                setLoading(false);
            }
        };

        if (isConnected && address) {
            console.log('User is connected:', address);
            fetchEventAndTickets();
        } else {
            console.log('User not connected or address missing');
        }
    }, [address, isConnected]);

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatTxHash = (hash: string) => {
        return `${hash.slice(0, 10)}...`;
    };

    if (loading) {
        console.log('Loading dashboard...');
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-8">
                        <div className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-6 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (unauthorized) {
        console.log('Rendering unauthorized message');
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center transform transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚫</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You are not authorized to view this dashboard. Only the event organizer can access this page.</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    console.log('Rendering dashboard UI');
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-md mb-4">
                        <span className="text-purple-600 mr-2">✨</span>
                        <span className="text-sm font-medium text-gray-700">Event Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        {event?.eventName}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your event tickets and track performance
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row px-12  gap-8">
                    {/* Left Column - Event Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl w-96">
                            {/* Event Image */}
                            <div className="relative h-48 bg-gradient-to-r from-purple-400 to-blue-500">
                                {event?.image && (
                                    <img
                                        src={event.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                        alt={event.eventName}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute top-4 right-4">
                                    {event?.verifiedOrganizer && (
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">{event?.eventName}</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-5 h-5 mr-3">📅</span>
                                        <span>{formatDate(event?.date)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-5 h-5 mr-3">📍</span>
                                        <span>{event?.venue}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-5 h-5 mr-3">💰</span>
                                        <span>{event?.price} ETH</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6">{event?.description}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">{event?.mintedCount}</div>
                                        <div className="text-sm text-gray-600">Tickets Sold</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{event?.maxTickets - event?.mintedCount}</div>
                                        <div className="text-sm text-gray-600">Available</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Sold</span>
                                        <span>{event?.mintedCount}/{event?.maxTickets}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(event?.mintedCount / event?.maxTickets) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tickets */}
                    <div className="w-full h-full">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl w-full">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <span className="mr-2">🎟️</span>
                                        Minted Tickets
                                    </h2>
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {tickets.length} Total
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {tickets.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🎫</span>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Tickets Yet</h3>
                                        <p className="text-gray-500">Tickets will appear here once users start minting</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {tickets.map((ticket, index) => (
                                            <div
                                                key={ticket._id}
                                                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                                                style={{
                                                    animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-purple-600 font-bold">#{ticket.tokenId}</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-800">Token #{ticket.tokenId}</div>
                                                            <div className="text-sm text-gray-500">{formatWalletAddress(ticket.ownerWallet)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {ticket.isClaimed ? (
                                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                ✅ Claimed
                                                            </span>
                                                        ) : (
                                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                ⏳ Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Transaction:</span>
                                                        <Link
                                                            target="_blank"
                                                            href={`https://calibration.filfox.info/en/message/${ticket.txHash}`}
                                                            rel="noreferrer"
                                                            className="text-purple-600 hover:text-purple-800 font-medium ml-1 transition-colors duration-200"
                                                        >
                                                            {formatTxHash(ticket.txHash)}
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Metadata:</span>
                                                        <Link
                                                            href={ticket.tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                                            target="_blank"
                                                            className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition-colors duration-200"
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                </div>

                                                {ticket.mintedAt && (
                                                    <div className="text-xs text-gray-400 mt-2">
                                                        Minted: {new Date(ticket.mintedAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default EventDashboard;