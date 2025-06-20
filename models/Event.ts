import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: String, required: true }, 
  venue: { type: String, required: true },
  description: { type: String },
  image: { type: String }, 

  price: { type: String, required: true },
  maxTickets: { type: Number, default: 50 }, 
  mintedCount: { type: Number, default: 0 }, 

  organizerWallet: { type: String, required: true },
  verifiedOrganizer: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true }, 

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
