import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import { clerkMiddleware } from "@clerk/express";
import webhookRoutes from "./WebhookRoutes.js"; // Use default import
import vapiRouter from "./routes/vapiRouter.js"; // Import the vapiRouter

dotenv.config();

const app = express();

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(cors({ origin: "https://intervia-two.vercel.app" }));
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/vapi", vapiRouter);
// app.use(clerkMiddleware());
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
