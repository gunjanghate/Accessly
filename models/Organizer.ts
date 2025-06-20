import mongoose from "mongoose";
const OrganizerSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true },
  name: String,
  email: String,
  isVerified: { type: Boolean, default: false },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Organizer || mongoose.model("Organizer", OrganizerSchema);
