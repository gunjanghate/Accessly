"use client"
import * as React from 'react';

import { motion, easeInOut, easeOut } from 'framer-motion';
import {
  Shield,
  Zap,
  Globe,
  QrCode,
  ArrowRight,
  CheckCircle,

  Sparkles
} from 'lucide-react';
import { Edu_AU_VIC_WA_NT_Guides } from 'next/font/google';
import { useRouter } from 'next/navigation';
const heroFont = Edu_AU_VIC_WA_NT_Guides({
  variable: "--font-eb-gramond",
  subsets: ["latin"],
});
const HeroSection = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: easeOut // use the imported easing function
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: easeInOut
      }
    }
  };

  const features = [
    { icon: Shield, text: "Scam-proof NFT tickets" },
    { icon: Globe, text: "Web3-native platform" },
    { icon: QrCode, text: "Instant QR verification" },
    { icon: Zap, text: "Lightning-fast transfers" }
  ];

  const stats = [
    { number: "99.9%", label: "Fraud Prevention" },
    { number: "0.1s", label: "Verification Speed" },
    { number: "100%", label: "Transparency" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '-2s' }}
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '-4s' }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOSwgMTQwLCAyNDgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">The Future of Event Ticketing</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight flex flex-col"
          >
            <span className={`font-serif ${heroFont.variable} bg-gradient-to-br from-indigo-600  to-purple-600 bg-clip-text font-semibold italic text-transparent text-6xl py-2`}>
              Accessly
            </span>

            <span className="bg-gradient-to-br pb-3 bg-clip-text text-transparent from-neutral-500 to-neutral-950 font-bold text-4xl md:text-5xl lg:text-6xl">
              Decentralized Ticketing
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            The first Web3-native event platform that eliminates fake tickets through
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent "> NFT technology</span>,
            crypto payments, and instant QR verification.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <feature.icon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center justify-center space-x-2">
                <span
                  onClick={() => {
                    router.push("/create-event")
                  }}>Create Event</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                router.push("/events")
              }}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-t-indigo-600 border-purple-600 border-b-purple-600 text-gray-700 font-semibold rounded-full text-xl hover:bg-white transition-all duration-300 shadow-lg cursor-pointer"
            >
              Browse Events
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Problem Statement */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Web2 Ticketing is Broken
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Fake and duplicate ticket sales</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Lack of transparency in resales</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">No real-time entry tracking</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Centralized data control</span>
                  </div>
                </div>
              </div>

              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Accessly Solution</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  By minting tickets as NFTs and leveraging blockchain technology, we ensure
                  authenticity, enable seamless transfers, and provide complete transparency
                  in the event ecosystem.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-sm"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 left-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-sm"
      />
    </div>
  );
};

export default HeroSection;