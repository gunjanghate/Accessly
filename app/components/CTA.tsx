"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
const CTA = () => {
    const router = useRouter();
  return (
    <div className="relative bg-transparent py-16 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/5 via-blue-600/10 to-blue-600/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-8 shadow-lg">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700">The Future of Event Ticketing</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-3 leading-tight">
          <span className="bg-gradient-to-br pb-3 bg-clip-text text-transparent from-neutral-500 to-neutral-950 ">Ready to </span>
          <span className="bg-gradient-to-r from-indigo-600  to-purple-600 bg-clip-text text-transparent">
            Transform
          </span>
          <br />
          <span className="bg-gradient-to-br pb-3 bg-clip-text text-transparent from-neutral-500 to-neutral-950">Your Events?</span>
        </h2>

        <p className="text-xl md:text-xl text-slate-600 mb-6 max-w-3xl mx-auto leading-relaxed">
          Join thousands of event creators who trust Accessly for secure, 
          decentralized ticketing powered by blockchain technology.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <button onClick={()=>{
            router.push("/create-event")
          }}  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 min-w-[200px] cursor-pointer hover:animate-bounce hover:scale-110">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create Event
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Scam-proof NFT tickets</span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Lightning-fast transfers</span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Instant QR verification</span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CTA;