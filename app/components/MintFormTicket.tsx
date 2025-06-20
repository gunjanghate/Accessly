'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FormData } from "@/types";
import { uploadFileToPinata, uploadMetadataToPinata } from "@/lib/pinata";
import { getTicketContract } from "@/lib/contract";
import { ethers } from "ethers";

type MintFormTicketProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const MintFormTicket: React.FC<MintFormTicketProps> = ({ formData, setFormData }) => {
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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

      let imageURI = "";
      if (formData.bannerImage && typeof formData.bannerImage !== "string") {
        setUploading(true);
        imageURI = await uploadFileToPinata(formData.bannerImage);
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
    } catch (err: unknown) {
      console.error("❌ Mint failed:", err);
      if (err instanceof Error) {
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="eventName"
        placeholder="Event Name"
        value={formData.eventName}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="eventDate"
        placeholder="Date"
        value={formData.eventDate}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="seatNumber"
        placeholder="Seat Number"
        value={formData.seatNumber}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="price"
        placeholder="Price (in tFIL)"
        value={formData.price}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />

      <Image
        src={
          typeof formData.bannerImage === "string" && formData.bannerImage
            ? formData.bannerImage
            : "/placeholder.png"
        }
        alt="banner"
        height={100}
        width={200}
      />

      <button
        type="submit"
        disabled={minting || uploading}
        className={`w-full py-2 rounded ${
          minting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        } text-white font-semibold transition`}
      >
        {minting ? "Minting..." : "Mint Ticket"}
      </button>

      {txHash && (
        <p className="text-green-600 mt-2">
          ✅ Ticket minted! Tx:{" "}
          <a
            href={`https://calibration.filfox.info/en/message/${txHash}`}
            target="_blank"
            className="underline"
          >
            {txHash.slice(0, 10)}...
          </a>
        </p>
      )}

      {error && <p className="text-red-600 mt-2">⚠️ {error}</p>}
    </form>
  );
};

export default MintFormTicket;
