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

  try {
    console.log("Received request to generate interview questions:", {
      type,
      role,
      level,
      techstack,
      amount,
      userId,
    });
    const techStackArray = techstack
      ?.split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

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

    // Parse the output
    let questions;
    try {
      questions = JSON.parse(questionsJson);
      console.log("Parsed JSON questions:", questions);
    } catch (jsonError) {
      console.warn(
        "JSON parsing failed, attempting to parse as plain text:",
        jsonError.message
      );
      // Fallback: Split plain text by newlines and clean up
      questions = questionsJson
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0); // Remove empty lines
    }

    // Validate questions
    console.log("Processed questions:", questions);
    console.log("Is questions an array?", Array.isArray(questions));

    if (!questions.every((q) => typeof q === "string")) {
      throw new Error("Not all questions are strings");
    }

    // Remove duplicates
    questions = [...new Set(questions)]; // Ensure unique questions
    console.log("Unique questions:", questions);

    // Ensure the correct number of questions
    if (questions.length !== amount) {
      console.warn(`Expected ${amount} questions, but got ${questions.length}`);
    }

    const interviewData = {
      role,
      type,
      level,
      techStack: techStackArray, // Convert to array
      questions, // Array of strings
      userId,
      amount,
      finalized: true,
    };

    const newInterview = new Interview(interviewData);
    const savedInterview = await newInterview.save();
    console.log("Interview saved successfully:", savedInterview);
    // Respond early to avoid Vapi timeout
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in /generate:", error.message, error.stack);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

export default router;
