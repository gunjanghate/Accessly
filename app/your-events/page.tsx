'use client';
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useWeb3 } from "@/context/Web3Context";
import { useRouter } from "next/navigation";
export default function MyEventsPage() {
    const router = useRouter();
  const { address, isConnected } = useWeb3();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!address) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/events?organizer=${address}`);
        const data = await res.json();
        setEvents(data);
        console.log("Fetched events:", data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchMyEvents();
    }
  }, [address, isConnected]);


const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive:boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };
 const LoadingCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
        
      <div className="animate-pulse">
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-300 rounded-full mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
                                      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/5 via-blue-600/10 to-blue-600/5 z-0"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-pink-500/20 z-0 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/2 z-0 to-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 z-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-blue-400/10 rounded-full blur-3xl"></div>

      {/* Header Section */}
      <div className="relative overflow-hidden z-10">

        <div className="relative px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">

              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Your Events Dashboard
              </h1>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                Manage your blockchain events and track ticket sales in real-time
              </p>
              
              {address && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12 z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} />
              ))}
            </motion.div>
          ) : events.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-6 z-[50] relative"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                //   scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-8xl mb-8 z-10"
              >
                🎪
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4 z-10">
                No Events Created Yet
              </h3>
              
              <div className="flex flex-col items-center mb-8 z-10">
                <p className=" max-w-md mx-auto text-xl font-medium">
                  Create your first event, engage your audience, and start selling NFT tickets today!
                </p>
              </div>
              
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer z-[60] relative"
              style={{ zIndex: 60, position: "relative" }}
            >
              <span className="flex items-center justify-center space-x-2 z-[61] relative">
                <span
                  onClick={() => {
                    router.push("/create-event")
                  }}>Create Event</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
            >

              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
          
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image.replace('ipfs://', 'https://ipfs.io/ipfs/') || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"}
                      alt={event.eventName}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.isActive)}`}>
                        {getStatusText(event.isActive)}
                      </span>
                    </div>
                    
                    {/* Verified Badge */}
                    {event.verifiedOrganizer && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <span className="mr-1">✓</span>
                          Verified
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.eventName}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          📅
                        </div>
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          📍
                        </div>
                        <span>{event.venue}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          💰
                        </div>
                        <span className="font-semibold text-green-600">{event.price} ETH</span>
                      </div>
                    </div>

                    {/* Ticket Sales Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tickets Sold</span>
                        <span className="text-sm font-bold text-gray-900">
                          {event.mintedCount}/{event.maxTickets}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.mintedCount / event.maxTickets) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {((event.mintedCount / event.maxTickets) * 100).toFixed(1)}% sold
                        </span>
                        <span className="text-xs text-gray-500">
                          {event.maxTickets - event.mintedCount} remaining
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.a
                      href={`/event-dashboard/${event._id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
                    >
                      Open Dashboard
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}