import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, required: true },
    teckStack: { type: [String], required: true },
    questions: { type: [String], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    finalized: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Interview", interviewSchema);
