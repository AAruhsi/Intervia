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

    const { text: questionsJson } = await generateText({
      model,
      prompt: `Prepare questions for a job interview. 
        The job role is ${role}.
        The job experience level is ${level}.
        The technology stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions to generate is: ${amount}.
        Please return only the questions without any additional text.
        The questions are going to be read by a voice assistant, so they should not use "/" or "*" or any other special characters.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "string",
        },
      },
    });

    console.log("Raw generateText output (JSON string):", questionsJson);

    // Parse the JSON string
    let questions;
    try {
      questions = JSON.parse(questionsJson);
      console.log("Parsed questions:", questions);
      console.log("Is questions an array?", Array.isArray(questions));
      console.log(
        "Are all elements strings?",
        questions.every((q) => typeof q === "string")
      );
      if (!Array.isArray(questions)) {
        throw new Error("Parsed questions is not an array");
      }
      if (!questions.every((q) => typeof q === "string")) {
        throw new Error("Not all questions are strings");
      }
    } catch (parseError) {
      console.error("Raw questions JSON:", questionsJson);
      throw new Error(`Failed to parse questions JSON: ${parseError.message}`);
    }

    const interviewData = {
      role,
      type,
      level,
      techStack: techstack.split(",").map((tech) => tech.trim()), // Convert to array
      questions, // Array of strings
      userId,
      amount,
      finalized: true,
    };

    const newInterview = new Interview(interviewData);
    const savedInterview = await newInterview.save();
    console.log("Interview saved successfully:", savedInterview);
  } catch (error) {
    console.error("Error in /generate:", error.message, error.stack);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

export default router;
