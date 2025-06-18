import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  eventName: String,
  date: String,
  venue: String,
  seatNumber: String,
  price: String,
  image: String,
   tokenURI: String,       
  txHash: String,        
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
