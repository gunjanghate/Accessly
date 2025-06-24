"use client";
import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.5)",
                  "0 0 40px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(99, 102, 241, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[12rem] md:text-[16rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none"
            >
              404
            </motion.h1>
            
            {/* Floating elements around 404 */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-8 left-8 md:top-16 md:left-16 text-4xl"
            >
              🎪
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [10, -10, 10],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute top-12 right-12 md:top-20 md:right-20 text-3xl"
            >
              🎫
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [-5, 15, -5],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute bottom-16 left-20 md:bottom-24 md:left-32 text-2xl"
            >
              🔗
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [15, -5, 15],
                rotate: [0, -8, 8, 0]
              }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute bottom-8 right-16 md:bottom-16 md:right-24 text-3xl"
            >
              💎
            </motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Looks like this page got lost in the decentralized web! The event or page you're looking for might have been moved, deleted, or never existed in our smart contracts.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              🔍 What you can do instead:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">🏠</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Go to Homepage</p>
                  <p className="text-sm text-gray-600">Start fresh from our main page</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm">🎪</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Browse Events</p>
                  <p className="text-sm text-gray-600">Discover amazing Web3 events</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">🎫</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">My Tickets</p>
                  <p className="text-sm text-gray-600">Check your NFT tickets</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-pink-600 text-sm">➕</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Create Event</p>
                  <p className="text-sm text-gray-600">Launch your own event</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
          >
            ← Go Back
          </motion.button>
          
          <motion.a
            href="/"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
          >
            🏠 Home Page
          </motion.a>
          
          <motion.a
            href="/events"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
          >
            🎪 Browse Events
          </motion.a>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm">
            Lost in the metaverse? Our{' '}
            <span className="font-medium text-purple-600">Accessly</span>{' '}
            team is here to help you navigate the Web3 event space! 🚀
          </p>
        </motion.div>


      </div>
    </div>
  );
};

export default NotFound;