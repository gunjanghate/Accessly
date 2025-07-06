'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FormData } from "@/types";
import { uploadFileToPinata, uploadMetadataToPinata } from "@/lib/pinata";
import { getTicketContract } from "@/lib/contract";
import { ethers } from "ethers";
import ShareToX from "./ShareToX";

type MintFormTicketProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const MintFormTicket: React.FC<MintFormTicketProps> = ({ formData, setFormData }) => {
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [xData, setxData] = useState<{
    eventName: string;
    date: string;
    venue: string;
    seatNumber: string;
  }>({
    eventName: "",
    date: "",
    venue: "",
    seatNumber: "",
  });

  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {


    return () => {
      console.log("formData:", formData);
    }
  }, [])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinting(true);
    setError("");

    try {
      if (!window.ethereum) throw new Error("MetaMask not found.");

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getTicketContract(signer);

      let imageURI = formData.bannerImage;
      if (formData.bannerImage && typeof formData.bannerImage !== "string") {
        setUploading(true);
        imageURI = await uploadFileToPinata(formData.bannerImage);
        console.log("✅ Image uploaded to Pinata:", imageURI);
        setUploading(false);
      }

      const metadata = {
        name: `${formData.eventName} - ${formData.seatNumber}`,
        description: `Ticket for ${formData.eventName} on ${formData.eventDate} at ${formData.venue}`,
        image: imageURI,
        attributes: [
          { trait_type: "Event", value: formData.eventName },
          { trait_type: "Date", value: formData.eventDate },
          { trait_type: "Location", value: formData.venue },
          { trait_type: "Seat", value: formData.seatNumber },
          { trait_type: "Price", value: `${formData.price} tFIL` },
        ],
      };

      const tokenURI = await uploadMetadataToPinata(metadata);

      // Get tokenId BEFORE minting
      const nextId = await contract.nextTokenId();
      const tokenId = Number(nextId); // will be used post mint

      const tx = await contract.mintTicket(
        await signer.getAddress(),
        formData.eventName,
        formData.eventDate,
        formData.venue,
        formData.seatNumber,
        ethers.parseEther(formData.price),
        tokenURI
      );

      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      console.log("✅ Ticket Minted!", receipt.hash);

      // Save ticket to DB
      console.log("Saving ticket to DB...");
      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: formData.eventId,
          tokenId,
          tokenURI,
          txHash: receipt.hash,
          ownerWallet: (await signer.getAddress()).toLowerCase(),
        }),
      });
      console.log("✅ Ticket saved to DB");
      // Update minted count
      console.log("Updating minted count for event...", formData.eventId);
      await fetch(`/api/events/${formData.eventId}/minted`, {
        method: "PATCH",
      });
      console.log("✅ Event minted count updated");
      setIsSuccess(true);
      setxData({
        eventName: formData.eventName,
        date: formData.eventDate,
        venue: formData.venue,
        seatNumber: formData.seatNumber,
      });


    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes('could not decode result data') &&
        err.message.includes('nextTokenId')
      ) {
        setError("Please connect your metamask wallet with filecoin network");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Mint failed.");
      }
    } finally {
      setMinting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto md:p-6">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-t-indigo-600 border-purple-600 border-b-purple-600 overflow-hidden">
        {/* Header */}
        <div className=" p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Mint Your Ticket</h2>
              <p className="text-indigo-600 text-sm">Create your NFT ticket on the blockchain</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Event Name</span>
                </span>
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={formData.eventName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed transition-all duration-200 focus:outline-none"
                readOnly
              />
            </div>

            {/* Event Date */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Date</span>
                </span>
              </label>
              <input
                type="text"
                name="eventDate"
                placeholder="Date"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed transition-all duration-200 focus:outline-none"
                readOnly
              />
            </div>

            {/* Venue */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Venue</span>
                </span>
              </label>
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed transition-all duration-200 focus:outline-none"
                readOnly
              />
            </div>

            {/* Seat Number */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                  </svg>
                  <span>Seat Number</span>
                </span>
              </label>
              <input
                type="text"
                name="seatNumber"
                placeholder="e.g., A-12, VIP-001"
                value={formData.seatNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none hover:border-gray-400"
              />
            </div>

            {/* Price */}
            <div className="group md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Price (in tFIL)</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  placeholder="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl bg-white transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none hover:border-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                  tFIL
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Banner Image</span>
              </span>
            </label>

            <div className="relative">
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="banner-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:border-indigo-400 group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-indigo-600 transition-colors duration-200">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src={
                  typeof formData.bannerImage === "string" && formData.bannerImage
                    ? formData.bannerImage
                    : "/placeholder.png"
                }
                alt="Banner preview"
                height={200}
                width={400}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={minting || uploading}
            className={`relative w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform ${minting || uploading
              ? "bg-gray-400 cursor-not-allowed scale-95"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl active:scale-95"
              } shadow-lg`}
          >
            <div className="flex items-center justify-center space-x-3">
              {(minting || uploading) && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
              <span>
                {uploading ? "Uploading Image..." : minting ? "Minting Ticket..." : "🎫 Mint Ticket"}
              </span>
            </div>

            {/* Loading overlay */}
            {(minting || uploading) && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </button>

          {/* Success Message */}
          {txHash && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-800">Ticket minted successfully! 🎉</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Transaction:{" "}
                    <a
                      href={`https://calibration.filfox.info/en/message/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs bg-green-100 px-2 py-1 rounded hover:bg-green-200 transition-colors duration-200 underline"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </a>
                  </p>
                </div>
                {isSuccess && (
                  <ShareToX
                    title="🎟️ Just Minted My NFT Ticket on Accessly!"
                    content={`I'm attending '${xData.eventName}' on ${xData.date} at ${xData.venue} 🎉 My seat: ${xData.seatNumber}. Mint yours now on Accessly — powered by Web3!`}
                    hashtags={["Accessly", "NFTtickets", "Web3Events", "ProofOfAttendance", "Blockchain"]}
                    url="https://accessly-self.vercel.app/events"
                  />

                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">Minting failed</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MintFormTicket;