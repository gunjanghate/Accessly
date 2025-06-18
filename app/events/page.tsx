'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { getAllMintedTickets } from "@/lib/getTokensByOwner";
import { motion, AnimatePresence } from "framer-motion";

type Attribute = {
  trait_type: string;
  value: string;
};

type EventMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
  tokenId: number;
  owner: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFromChain = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokens = await getAllMintedTickets(provider);

        const eventData = await Promise.all(
          tokens.map(async (token) => {
            try {
              const uri = token.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
              const res = await fetch(uri);
              const contentType = res.headers.get("content-type");

              if (!contentType?.includes("application/json")) {
                console.warn(`Skipping token ${token.tokenId} - not JSON`);
                return null;
              }

              const meta = await res.json();

              return {
                name: meta.name,
                description: meta.description,
                image: meta.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
                attributes: meta.attributes,
                tokenId: token.tokenId,
                owner: token.owner,
              } as EventMetadata;
            } catch (err) {
              console.log(err)
              console.warn(`Skipping token ${token.tokenId} due to metadata error`);
              return null;
            }
          })
        );

        setEvents(eventData.filter((e): e is EventMetadata => e !== null));
      } catch (err) {
        console.error("Failed to load tickets from blockchain", err);
      } finally {
        setLoading(false);
      }
    };

    loadFromChain();
  }, []);

  // Loading skeleton component
  const EventSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-xl h-48 w-full"></div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-indigo-200/50 to-purple-200/50 h-6 rounded-lg w-3/4"></div>
            <div className="bg-gradient-to-r from-indigo-200/50 to-purple-200/50 h-4 rounded w-full"></div>
            <div className="bg-gradient-to-r from-indigo-200/50 to-purple-200/50 h-4 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const EventCard = ({ event, index }: { event: EventMetadata; index: number }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getAttributeValue = (traitType: string) => {
      return event.attributes.find((attr) => attr.trait_type === traitType)?.value;
    };

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
        className="group relative overflow-hidden cursor-pointer rounded-2xl max-w-md mx-auto"
      >
        {/* Glowing background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">

          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="p-6">
            {/* Image container */}
            <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
              {!imageError ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 animate-pulse rounded-xl"></div>
                  )}
                  <motion.img
                    src={event.image}
                    alt={event.name}
                    className={`w-full h-48 object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center text-indigo-400">
                    <div className="text-4xl mb-2">🎪</div>
                    <div className="text-sm font-medium">Event Image</div>
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
                className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2"
                whileHover={{ x: 2 }}
              >
                {event.name}
              </motion.h2>

              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-indigo-500">📅</span>
                  <span>{getAttributeValue("Date") || "Date TBA"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-purple-500">📍</span>
                  <span>{getAttributeValue("Location") || "Location TBA"}</span>
                </div>
              </div>

              {/* Price Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)"
                }}
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                🎟️ {getAttributeValue("Price") || "Free"}
              </motion.div>

              {/* Description */}
              {event.description && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                  {event.description}
                </p>
              )}

              {/* Bottom section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                {/* Token ID Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(107, 114, 128, 0.15)"
                  }}
                >
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                  Token #{event.tokenId}
                </motion.div>

                {/* Event icon */}
                <motion.div
                  className="text-2xl"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  🎪
                </motion.div>
              </div>

              {/* View Ticket Button */}
              <motion.button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/btn"
                onClick={() => router.push(`/mint?tokenId=${event.tokenId}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Ticket
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            className="text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎫
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            All Minted Events
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Discover amazing events and mint your tickets
        </p>
      </motion.div>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎪
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Events Found</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              No events have been minted yet. Be the first to create an amazing event!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="events"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {events.map((event, index) => (
              <EventCard
                key={event.tokenId}
                event={event}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}