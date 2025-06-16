'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { getTicketContract } from "@/lib/contract";
import { Calendar, MapPin, Tag, DollarSign,Image, Ticket } from "lucide-react";

export default function MintTicketForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    seatNumber: "",
    price: "",
    tokenURI: ""
  });
  
  const [minting, setMinting] = useState(false);
  console.log(minting)
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: minting, 3: success

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    const requiredFields: (keyof typeof formData)[] = ['eventName', 'eventDate', 'venue', 'seatNumber', 'price'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setMinting(true);
      setStep(2);

      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getTicketContract(signer);

      // Use provided tokenURI or fallback to default
      const tokenURI = formData.tokenURI || "https://orange-above-bat-689.mypinata.cloud/ipfs/QmUARbXsViKcy6j4goVK5S921AbE9pmVPcrzpMrXFwyvSy";

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
    } catch (err) {
      console.error("Mint failed:", err);
      setStep(1);
      alert("Minting failed. Please try again.");
    } finally {
      setMinting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      eventDate: "",
      venue: "",
      seatNumber: "",
      price: "",
      tokenURI: ""
    });
    setTxHash("");
    setStep(1);
  };

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
    <div id='mint'  className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl my-12 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOSwgMTQwLCAyNDgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Ticket className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900"><span className="italic bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">Accesly</span> - Mint Event Ticket</h1>
          <p className="text-gray-600">Create your NFT event ticket</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step >= num
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {num}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6 drop-shadow-2xl"
            >
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
                    placeholder="e.g., A42"
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
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.01"
                    required
                  />
                </motion.div>
              </div>

              {/* Token URI (Optional) */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Image className="w-4 h-4"
             
                  />
                  <span>Metadata URI (Optional)</span>
                </label>
                <input
                  type="url"
                  name="tokenURI"
                  value={formData.tokenURI}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://your-metadata-uri.com"
                />
                <p className="text-xs text-gray-500">Leave empty to use default metadata</p>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mint Ticket NFT
              </motion.button>
            </motion.form>
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
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Minting Your Ticket...</h3>
                <p className="text-gray-600">Please confirm the transaction in your wallet</p>
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
                <h3 className="text-2xl font-bold text-gray-900">Ticket Minted Successfully!</h3>
                <p className="text-gray-600">Your NFT ticket has been created on the blockchain</p>
                
                {txHash && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-700">Transaction Hash:</p>
                    <a
                      href={`https://calibration.filfox.info/en/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    >
                      <span className="font-mono text-sm">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>

              <motion.button
                onClick={resetForm}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mint Another Ticket
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}