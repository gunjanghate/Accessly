import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  tokenId: { type: Number, required: true },
  tokenURI: { type: String, required: true },
  txHash: { type: String, required: true },

  ownerWallet: { type: String, required: true },
  isClaimed: { type: Boolean, default: false }, 
  mintedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
