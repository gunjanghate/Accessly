'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { getTicketContract } from "@/lib/contract";
import { Calendar, MapPin, Tag, DollarSign, Image, Ticket, Eye, AlertCircle } from "lucide-react";
import { uploadMetadataToPinata, uploadFileToPinata } from "@/lib/pinata";

export default function MintTicketForm() {
  const [formData, setFormData] = useState<{
    eventName: string;
    eventDate: string;
    venue: string;
    seatNumber: string;
    price: string;
    bannerImage: File | null;
    tokenURI: string;
  }>({
    eventName: "",
    eventDate: "",
    venue: "",
    seatNumber: "",
    price: "",
    bannerImage: null,
    tokenURI: ""
  });

  const [minting, setMinting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMetadata, setUploadingMetadata] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: minting, 3: success
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      setFormData(prev => ({ ...prev, bannerImage: file }));
      setError("");
    }
  };

  const validateForm = () => {
    const requiredFields: (keyof typeof formData)[] = [
      "eventName",
      "eventDate",
      "venue",
      "seatNumber",
      "price",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    // Validate event date is not in the past
    const eventDate = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      setError("Event date cannot be in the past");
      return false;
    }

    // Validate price is positive
    const price = parseFloat(formData.price);
    if (price <= 0 || isNaN(price)) {
      setError("Price must be a valid number greater than 0");
      return false;
    }

    // Validate seat number format (basic check)
    if (!/^[A-Za-z0-9\-\s]+$/.test(formData.seatNumber)) {
      setError("Seat number contains invalid characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setMinting(true);
      setStep(2);
      setError("");

      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask to continue.");
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getTicketContract(signer);

      let imageURI = "";
      if (formData.bannerImage) {
        try {
          setUploadingImage(true);
          imageURI = await uploadFileToPinata(formData.bannerImage);
          console.log("🖼 Image uploaded:", imageURI);
        } catch (error) {
          console.log(error)
          throw new Error("Failed to upload image. Please try again.");
        } finally {
          setUploadingImage(false);
        }
      }

      // Upload metadata
      const metadata = {
        name: `${formData.eventName} - ${formData.seatNumber}`,
        description: `Ticket for ${formData.eventName} on ${formData.eventDate} at ${formData.venue}`,
        image: imageURI,
        attributes: [
          { trait_type: "Event", value: formData.eventName },
          { trait_type: "Date", value: formData.eventDate },
          { trait_type: "Location", value: formData.venue },
          { trait_type: "Seat", value: formData.seatNumber },
          { trait_type: "Price", value: `${formData.price} ETH` },
          { trait_type: "Category", value: "Event Ticket" },
        ],
      };

      let tokenURI;
      if (formData.tokenURI) {
        tokenURI = formData.tokenURI;
      } else {
        try {
          setUploadingMetadata(true);
          tokenURI = await uploadMetadataToPinata(metadata);
          await fetch("/api/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData            ),
          });

          console.log("📦 Metadata uploaded to IPFS:", tokenURI);
        } catch (error) {
          console.log(error);
          throw new Error("Failed to upload metadata. Please try again.");
        } finally {
          setUploadingMetadata(false);
        }
      }

      // Mint the NFT
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
      setStep(3);
      console.log("✅ Minted! Tx:", receipt.hash);

    } catch (err: unknown) {
      console.error("❌ Mint failed:", err);
      setStep(1);

      // More specific error messages
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: number }).code;
        if (code === 4001) {
          setError("Transaction rejected by user.");
        } else if (code === -32603) {
          setError("Internal JSON-RPC error. Please try again.");
        } else if ("message" in err && typeof (err).message === "string" && (err).message.includes("insufficient funds")) {
          setError("Insufficient funds for transaction.");
        } else if ("message" in err && typeof (err).message === "string" && (err).message.includes("user rejected")) {
          setError("Transaction rejected by user.");
        } else if ("message" in err && typeof (err).message === "string") {
          setError(`Minting failed: ${(err).message}`);
        } else {
          setError("Minting failed. Please try again.");
        }
      } else if (typeof err === "object" && err !== null && "message" in err && typeof (err).message === "string") {
        setError(`Minting failed: ${(err).message}`);
      } else {
        setError("Minting failed. Please try again.");
      }
    } finally {
      setMinting(false);
      setUploadingImage(false);
      setUploadingMetadata(false);
    }
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      eventDate: "",
      venue: "",
      seatNumber: "",
      price: "",
      bannerImage: null,
      tokenURI: ""
    });
    setTxHash("");
    setStep(1);
    setError("");
    setShowPreview(false);
  };

  const TicketPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">Ticket Preview</h4>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Event:</span> {formData.eventName || "N/A"}</p>
        <p><span className="font-medium">Date:</span> {formData.eventDate || "N/A"}</p>
        <p><span className="font-medium">Venue:</span> {formData.venue || "N/A"}</p>
        <p><span className="font-medium">Seat:</span> {formData.seatNumber || "N/A"}</p>
        <p><span className="font-medium">Price:</span> {formData.price ? `${formData.price} ETH` : "N/A"}</p>
        {formData.bannerImage && (
          <p><span className="font-medium">Image:</span> {formData.bannerImage.name}</p>
        )}
      </div>
    </motion.div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
    >
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div id='mint' className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl my-12 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOSwgMTQwLCAyNDgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Ticket className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="italic bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">Accesly</span> - Mint Event Ticket
          </h1>
          <p className="text-gray-600">Create your NFT event ticket</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          {[
            { num: 1, label: "Form" },
            { num: 2, label: "Minting" },
            { num: 3, label: "Success" }
          ].map(({ num, label }) => (
            <div key={num} className="flex flex-col items-center space-y-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step >= num
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {num}
              </div>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Preview Toggle */}
              {(formData.eventName || formData.eventDate || formData.venue) && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showPreview ? "Hide" : "Show"} Preview</span>
                  </button>
                </div>
              )}

              {/* Preview */}
              {showPreview && <TicketPreview />}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4" />
                    <span>Event Name</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter event name"
                    required
                  />
                </motion.div>

                {/* Event Date & Venue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>Event Date</span>
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>Venue</span>
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter venue"
                      required
                    />
                  </motion.div>
                </div>

                {/* Seat Number & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Ticket className="w-4 h-4" />
                      <span>Seat Number</span>
                    </label>
                    <input
                      type="text"
                      name="seatNumber"
                      value={formData.seatNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., A42, VIP-1, GA"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      <span>Price (ETH)</span>
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.01"
                      required
                    />
                  </motion.div>
                </div>

                {/* Banner Image */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Image className="w-4 h-4" />
                    <span>Banner/Image</span>
                  </label>
                  <input
                    type="file"
                    name="banner"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500">Optional. Max 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                </motion.div>

                {/* Token URI (Optional) */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Image className="w-4 h-4" />
                    <span>Custom Metadata URI (Advanced)</span>
                  </label>
                  <input
                    type="url"
                    name="tokenURI"
                    value={formData.tokenURI}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://your-metadata-uri.com"
                  />
                  <p className="text-xs text-gray-500">Optional. Leave empty to auto-generate metadata from form data</p>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={minting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: minting ? 1 : 1.02 }}
                  whileTap={{ scale: minting ? 1 : 0.98 }}
                >
                  {minting ? "Minting..." : "Mint Ticket NFT"}
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="minting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12 space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"
              />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Minting Your Ticket...</h3>

                {/* Progress Steps */}
                <div className="space-y-2 text-sm text-gray-600">
                  {uploadingImage && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Uploading image...</span>
                    </div>
                  )}
                  {uploadingMetadata && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Uploading metadata...</span>
                    </div>
                  )}
                  {!uploadingImage && !uploadingMetadata && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Please confirm the transaction in your wallet</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
              >
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Ticket Minted Successfully! 🎉</h3>
                <p className="text-gray-600">Your NFT ticket has been created on the blockchain</p>

                {/* Success Details */}
                <div className="bg-green-50 rounded-lg p-4 space-y-2 text-left">
                  <h4 className="font-semibold text-green-800">Ticket Details:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Event:</strong> {formData.eventName}</p>
                    <p><strong>Date:</strong> {formData.eventDate}</p>
                    <p><strong>Venue:</strong> {formData.venue}</p>
                    <p><strong>Seat:</strong> {formData.seatNumber}</p>
                  </div>
                </div>

                {txHash && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-700">Transaction Hash:</p>
                    <a
                      href={`https://calibration.filfox.info/en/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 break-all"
                    >
                      <span className="font-mono text-sm">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={resetForm}
                  className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mint Another Ticket
                </motion.button>

                <motion.a
                  href={`https://calibration.filfox.info/en/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-indigo-600 text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View on Explorer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}