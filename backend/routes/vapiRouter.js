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
  const { type, role, level, techstack, amount, userId } = req.body;

  // Respond early to avoid Vapi timeout
  res.status(200).json({ success: true });

  try {
    console.log("Received request to generate interview questions:", {
      type,
      role,
      level,
      techstack,
      amount,
      userId,
    });

    const { text: questions } = await generateText({
      model,
      prompt: `Prepare questions for a job interview. 
        The job role is ${role}.
        The job experience level is ${level}.
        The technology stack used in the job is : ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions to generate is:  ${amount}.
        Please return only the questions without any additional text.
        The questions are going to be read by a voice assistant, so they should not use "/" or "*" or any other special characters.
        Return the questions formatted like this : ["Question 1", "Question 2", "Question 3" ]`,
    });
    console.log("Generated questions:", questions);
    const cleanJson = questions
      .replace(/```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    console.log("Generated  clean json:", cleanJson);
    const interviewData = {
      role,
      type,
      level,
      techStack: techstack, // fixed spelling
      questions: JSON.parse(cleanJson),
      userId,
      amount,
      finalized: true,
    };

    const newInterview = new Interview(interviewData);
    await newInterview.save();

    console.log("Interview saved successfully");
  } catch (error) {
    console.error("Error in /generate:", error);
    // Do not respond again — already handled above
  }
});

export default router;
