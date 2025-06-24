import express from "express";
import { Webhook } from "svix";
import User from "./models/User.js";

const router = express.Router();

// Middleware to parse raw body for webhook verification
router.post(
  "/register",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      // Log headers for debugging
      console.log("Headers:", req.headers);

      // Extract raw body
      const body = req.body.toString("utf8");

      // Initialize Svix Webhook with your secret (from Svix dashboard)
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);

      // Verify the webhook
      const evt = wh.verify(body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      }); // Type assertion due to potential TypeScript issues

      // Extract user data from the verified event
      const { id, email_addresses, first_name, last_name } = evt.data;

      // Save to MongoDB
      const newUser = new User({
        clerkId: id, // Note: 'clerkId' might need to be renamed to match Svix data structure
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      });

      await newUser.save();
      console.log("User saved to DB:", newUser);

      return res.status(200).send("User saved");
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return res.status(400).send("Webhook failed");
    }
  }
);

export default router;
