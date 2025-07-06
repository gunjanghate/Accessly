'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Tag, DollarSign, Image, Ticket, Eye, AlertCircle, Users, FileText } from "lucide-react";
import { uploadFileToPinata } from "@/lib/pinata";
import ShareToX from "./ShareToX";

export default function CreateEventForm() {
  const [formData, setFormData] = useState<{
    eventName: string;
    date: string;
    venue: string;
    description: string;
    price: string;
    maxTickets: string;
    bannerImage: File | null;
  }>({
    eventName: "",
    date: "",
    venue: "",
    description: "",
    price: "",
    maxTickets: "50",
    bannerImage: null,
  });
  const [xData, setxData] = useState<{
    eventName: string;
    date: string;
    venue: string;
  }>({
    eventName: "",
    date: "",
    venue: "",
  });

  const [isSuccess, setIsSuccess] = useState(false)
  const [creating, setCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventId, setEventId] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: creating, 3: success
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      "date",
      "venue",
      "price",
      "maxTickets"
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    // Validate event date is not in the past
    const eventDate = new Date(formData.date);
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

    // Validate max tickets
    const maxTickets = parseInt(formData.maxTickets);
    if (maxTickets <= 0 || isNaN(maxTickets)) {
      setError("Max tickets must be a valid number greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      setStep(2);
      setError("");

      // Check if MetaMask is available to get wallet address
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask to continue.");
      }

      // Request account access to get organizer wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!Array.isArray(accounts) || accounts.length === 0 || typeof accounts[0] !== "string") {
        throw new Error("Could not retrieve wallet address from MetaMask.");
      }
      const organizerWallet = accounts[0] as string;

      let imageURI = "";
      if (formData.bannerImage) {
        try {
          setUploadingImage(true);
          imageURI = await uploadFileToPinata(formData.bannerImage);
          console.log("🖼 Image uploaded:", imageURI);
        } catch (error) {
          console.log(error);
          throw new Error("Failed to upload image. Please try again.");
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare event data for MongoDB
      const eventData = {
        eventName: formData.eventName,
        date: formData.date,
        venue: formData.venue,
        description: formData.description,
        image: imageURI,
        price: formData.price,
        maxTickets: parseInt(formData.maxTickets),
        organizerWallet: organizerWallet,
        verifiedOrganizer: false,
        isActive: true
      };

      // Save event to MongoDB
      try {
        setSavingEvent(true);
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error("Failed to create event");
        }

        const result = await response.json();
        setEventId(result._id || result.id);
        setStep(3);
        setxData({
          eventName: formData.eventName,
          date: formData.date,
          venue: formData.venue,
        });
        setIsSuccess(true);
        console.log("✅ Event created successfully:", result);

      } catch (error) {
        console.log(error);
        throw new Error("Failed to save event. Please try again.");
      } finally {
        setSavingEvent(false);
      }

    } catch (err: unknown) {
      console.error("❌ Event creation failed:", err);
      setStep(1);

      // Handle different error types
      if (typeof err === "object" && err !== null && "message" in err && typeof (err).message === "string") {
        setError(`Event creation failed: ${(err).message}`);
      } else {
        setError("Event creation failed. Please try again.");
      }
    } finally {
      setCreating(false);
      setUploadingImage(false);
      setSavingEvent(false);
    }
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      date: "",
      venue: "",
      description: "",
      price: "",
      maxTickets: "50",
      bannerImage: null,
    });
    setEventId("");
    setStep(1);
    setError("");
    setShowPreview(false);
  };

  const EventPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">Event Preview</h4>
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
        <p><span className="font-medium">Date:</span> {formData.date || "N/A"}</p>
        <p><span className="font-medium">Venue:</span> {formData.venue || "N/A"}</p>
        <p><span className="font-medium">Description:</span> {formData.description || "N/A"}</p>
        <p><span className="font-medium">Price:</span> {formData.price ? `${formData.price} ETH` : "N/A"}</p>
        <p><span className="font-medium">Max Tickets:</span> {formData.maxTickets || "N/A"}</p>
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
    <div id='create-event' className="max-w-2xl mx-auto p-6 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl my-12 relative border-2 hover:border-purple-700 border-t-indigo-600 border-purple-600 border-b-purple-600 ">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOSwgMTQwLCAyNDgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
    


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-2 ">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Ticket className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="italic bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold font-serif">Accesly</span> - Create Event
          </h1>
          <p className="text-gray-600">Create your event for ticket sales</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          {[
            { num: 1, label: "Form" },
            { num: 2, label: "Creating" },
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
              {(formData.eventName || formData.date || formData.venue) && (
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
              {showPreview && <EventPreview />}

              <div className="space-y-6 ">
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
                      name="date"
                      value={formData.date}
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

                {/* Description - Full Width */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span>Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your event..."
                  />
                </motion.div>

                {/* Price & Max Tickets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4" />
                      <span>Max Tickets</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="maxTickets"
                      value={formData.maxTickets}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="50"
                      required
                    />
                  </motion.div>
                </div>

                {/* Banner Image */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Image className="w-4 h-4" />
                    <span>Event Banner</span>
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

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  onClick={handleSubmit}
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: creating ? 1 : 1.02 }}
                  whileTap={{ scale: creating ? 1 : 0.98 }}
                >
                  {creating ? "Creating Event..." : "Create Event"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="creating"
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
                <h3 className="text-xl font-semibold text-gray-900">Creating Your Event...</h3>

                {/* Progress Steps */}
                <div className="space-y-2 text-sm text-gray-600">
                  {uploadingImage && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Uploading banner image...</span>
                    </div>
                  )}
                  {savingEvent && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Saving event to database...</span>
                    </div>
                  )}
                  {!uploadingImage && !savingEvent && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span>Please confirm wallet connection</span>
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
                <h3 className="text-2xl font-bold text-gray-900">Event Created Successfully! 🎉</h3>
                <p className="text-gray-600">Your event is now live and ready for ticket sales</p>

                {/* Success Details */}
                <div className="bg-green-50 rounded-lg p-4 space-y-2 text-left">
                  <h4 className="font-semibold text-green-800">Event Details:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Event:</strong> {formData.eventName}</p>
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Venue:</strong> {formData.venue}</p>
                    <p><strong>Max Tickets:</strong> {formData.maxTickets}</p>
                    <p><strong>Price:</strong> {formData.price} ETH</p>
                  </div>
                </div>

                {eventId && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-700">Event ID:</p>
                    <p className="font-mono text-sm text-indigo-600 break-all">{eventId}</p>
                  </div>
                )}
              </div>
              {isSuccess &&(
                <ShareToX
                title="🎉 New Event Created on Accessly!"
                content={`Join us at the '${xData.eventName}' on ${xData.date} at ${xData.venue}. Mint your ticket now and be part of the future of decentralized ticketing!`}
                hashtags={["Accessly", "NewEvent", "NFTtickets", "Web3", "ProofOfAttendance"]}
                url="https://accessly-self.vercel.app/events"
              />
              )}


              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={resetForm}
                  className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Another Event
                </motion.button>

                <motion.button
                  onClick={() => window.location.href = '/events'}
                  className="border border-indigo-600 text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Events
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}