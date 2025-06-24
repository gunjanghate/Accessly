"use client"
import * as React from 'react';
import { Ticket, Shield, Zap, Github, Twitter,Mail, Globe, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Footer = () => {
    const router = useRouter();
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 text-gray-800 relative overflow-hidden border-t border-gray-200">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl"></div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic cursor-pointer font-serif"
                onClick={()=>{
                    router.push("/")
                }}>

                  Accessly
                </h3>
                <p className="text-sm text-gray-500 font-medium">NFT Ticketing</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The first Web3-native event platform that eliminates fake tickets through NFT technology, crypto payments, and instant QR verification.
            </p>
            <div className="flex space-x-3">
              <a href="https://x.com/gunjanghate11" className="p-3 bg-white hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <Twitter className="w-5 h-5 text-gray-600 hover:text-purple-600" />
              </a>
              <a href="https://github.com/gunjanghate/Accessly" className="p-3 bg-white hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <Github className="w-5 h-5 text-gray-600 hover:text-purple-600" />
              </a>
              <a href="mailto:ghategunjan@gmail.com" className="p-3 bg-white hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <Mail className="w-5 h-5 text-gray-600 hover:text-purple-600" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">Platform</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="/events" className="hover:text-purple-600 transition-colors duration-200 flex items-center space-x-2 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200">Browse Events</span>
              </a></li>
              <li><a href="/create-event" className="hover:text-purple-600 transition-colors duration-200 flex items-center space-x-2 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200">Create Event</span>
              </a></li>
              <li><a href="/your-tickets" className="hover:text-purple-600 transition-colors duration-200 flex items-center space-x-2 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200">Your Tickets</span>
              </a></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">Features</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Scam-proof NFT tickets</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Web3-native platform</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <QrCode className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-sm font-medium">Instant QR verification</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm font-medium">Lightning-fast transfers</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">Support</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-purple-600 transition-colors duration-200 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Documentation</span>
              </a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors duration-200 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Help Center</span>
              </a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors duration-200 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Contact Us</span>
              </a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors duration-200 group">
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Bug Reports</span>
              </a></li>
            </ul>
          </div>
        </div>

        {/* Web3 Stats Banner
        <div className="border-t border-gray-200 pt-12 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">12.5K+</div>
              <div className="text-sm text-gray-500 font-medium mt-1">Tickets Minted</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">850+</div>
              <div className="text-sm text-gray-500 font-medium mt-1">Events Created</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm text-gray-500 font-medium mt-1">Uptime</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">5.2K+</div>
              <div className="text-sm text-gray-500 font-medium mt-1">Active Users</div>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-500 text-sm font-medium">
            © 2025 Accessly. Built on Ethereum. Powered by Web3.
          </div>

        </div>

        {/* Blockchain Network Status */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-3 px-3 py-2 bg-white border border-green-200 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-semibold">Deployed on Filecoin testnet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;