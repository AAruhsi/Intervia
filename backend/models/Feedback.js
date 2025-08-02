import mongoose from "mongoose";

const CategoryScoreSchema = new mongoose.Schema({
  category: String,
  score: Number,
  comment: String,
});

const FeedbackSchema = new mongoose.Schema({
  interviewId: { type: String, required: true },
  userId: { type: String, required: true },
  totalScore: { type: Number, required: true },
  categoryScores: [CategoryScoreSchema],
  strengths: { type: [String], default: [] },
  areasForImprovement: { type: [String], default: [] },
  finalAssessment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", FeedbackSchema);
