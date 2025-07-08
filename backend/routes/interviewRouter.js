import express from "express";
import Interview from "../models/Interviews.js";
const router = express.Router();

router.get("/recommended", async (req, res) => {
  try {
    const interviews = await Interview.find({ finalized: true }) // Filter finalized interviews
      .limit(20) // Limit to 20 results
      .sort({ createdAt: -1 }); // Optional: newest first

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({
        message: "No finalized interviews found",
      });
    }

    res.status(200).json({
      message: "interviews fetched successfully",
      interviews,
    });
  } catch (error) {
    console.error("Error fetching finalized interviews:", error);
    res.status(500).json({
      message: "Error fetching user interviews",
      error: error.message,
    });
  }
});

router.get("/:userid", async (req, res) => {
  const userId = req.params.userid;

  try {
    const interviews = await Interview.find({ userId: userId });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({
        message: "No interviews found for this user",
      });
    }
    res.status(200).json({
      message: "User interviews fetched successfully",
      interviews: interviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching user interviews",
      error: error.message,
    });
  }
});

router.get("/getInterview/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const interviews = await Interview.findById(id);
    console.log(id);
    if (!interviews || interviews.length === 0) {
      return res.status(404).json({
        message: "No interviews found for this user",
      });
    }
    res.status(200).json({
      message: "User interview fetched successfully",
      interview: interviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching user interviews",
      error: error.message,
    });
  }
});

export default router;
