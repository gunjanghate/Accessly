'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import Image from "next/image";

type Ticket = {
  _id: string;
  eventId: string;
  tokenId: number;
  tokenURI: string;
  txHash: string;
  ownerWallet: string;
};

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
};

const MyTicketPage = () => {
  const { address, isConnected } = useWeb3();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [metadataMap, setMetadataMap] = useState<Record<number, Metadata>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!address) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/tickets?owner=${address}`);
        const data = await res.json();
        setTickets(data);
        console.log(address)

        // Fetch metadata for each ticket
        const metaMap: Record<number, Metadata> = {};
        await Promise.all(
          data.map(async (ticket: Ticket) => {
            try {
              const res = await fetch(ticket.tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/"));
              const metadata = await res.json();
              metaMap[ticket.tokenId] = metadata;
            } catch (err) {
              console.error("Failed to fetch metadata:", err);
            }
          })
        );
        setMetadataMap(metaMap);
      } catch (err) {
        console.error("Error loading tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex flex-col justify-center items-center px-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 bg-clip-text text-transparent">
          Your Tickets {isConnected && `(${address.slice(0, 6)}...${address.slice(-4)})`}
        </h1>
      </motion.div>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {tickets.map((ticket) => {
            const metadata = metadataMap[ticket.tokenId];
            return (
              <motion.div
                key={ticket._id}
                className="bg-white rounded-xl shadow-md p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {metadata?.image && (
                  <Image
                    src={metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                    alt="Ticket"
                    width={400}
                    height={200}
                    className="rounded-lg w-full object-cover"
                  />
                )}
                <h2 className="text-xl font-semibold mt-4">{metadata?.name}</h2>
                <p className="text-sm text-gray-600">{metadata?.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Token ID: {ticket.tokenId}
                </div>
                <a
                  href={`https://calibration.filfox.info/en/message/${ticket.txHash}`}
                  target="_blank"
                  className="text-indigo-600 text-sm underline mt-1 block"
                >
                  View on Filecoin Explorer
                </a>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTicketPage;
