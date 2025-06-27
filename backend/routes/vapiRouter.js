import { google } from "@ai-sdk/google";
import express from "express";
import { generateText } from "ai"; // or "@ai-sdk/core" depending on your setup
import Interview from "../models/Interviews.js"; // Adjust the path as necessary
const router = express.Router();

const model = google("gemini-1.5-flash", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, // Ensure you have set this in your environment variables
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the VAPI endpoint",
    status: "success",
  });
});

router.post("/generate", async (req, res) => {
  try {
    const { type, role, level, teckStack, amount, userId } = req.body;
    console.log("Received request to generate interview questions:", {
      type,
      role,
      level,
      teckStack,
      amount,
      userId,
    });
    const { text: questions } = await generateText({
      model,
      prompt: `Prepare questions for a job interview. 
        The job role is ${role}.
        The job experience level is ${level}.
        The technology stack used in the job is : ${teckStack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions to generate is:  ${amount}.
        Please return only the questions without any additional text.
        The questions are going to be read by a voice assistant, so they should not use "/" or "*" or any other special characters that might break the voice assistant reading them.
        Return the questions formatted like this : ["Question 1", "Question 2", "Question 3" ]`,
    });
    const interviewData = {
      role,
      type,
      level,
      teckStack: teckStack,
      questions: JSON.parse(questions),
      userId,
      amount,
      finalized: true,
    };
    const newInterview = new Interview(interviewData);
    await newInterview.save();

    res.status(200).json({
      message: "Interview questions generated successfully",
      questions: JSON.parse(questions),
    });
  } catch (error) {
    console.error("Error in /generate:", error);
    res.status(500).send("Error generating interview questions");
  }
});
export default router;
