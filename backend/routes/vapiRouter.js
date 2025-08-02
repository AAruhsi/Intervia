import { google } from "@ai-sdk/google";
import express from "express";
import { generateObject, generateText } from "ai"; // or "@ai-sdk/core" depending on your setup
import Interview from "../models/Interviews.js"; // Adjust the path as necessary
import { feedbackSchema } from "../../frontend/intervia/src/constants.js";
import Feedback from "../models/Feedback.js";
const router = express.Router();

const model = google("gemini-2.5-flash", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, // Ensure you have set this in your environment variables
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the VAPI endpoint",
    status: "success",
  });
});

router.post("/generateFeedback", async (req, res) => {
  const { interviewId, userId, transcript } = req.body;
  try {
    const formattedTranscript = transcript
      .map((sentence) => `-${sentence.role}: ${sentence.content}\n`)
      .join("");
    const {
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
    } = await generateObject({
      model,
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on the provided transcript in a thorough, detailed, and objective manner. Be critical and unbiased; if the candidate makes mistakes, clearly identify and explain them in your feedback. Use the transcript: ${formattedTranscript}.
              Score the candidate from 0 to 100 in the following categories only, providing a brief justification for each score:
              Communication Skills: Clarity of expression, articulation, and logical structure of responses.
              Technical Knowledge: Depth of understanding of key concepts relevant to the role.
              Problem Solving: Ability to analyze problems and propose effective solutions.
              Cultural and Role Fit: Alignment with company values and suitability for the job role.
                Confidence and Engagement: Confidence in delivery, engagement with questions, and overall presence.`,
      system:
        "You are a professional interviewer analyzing a mock interview.Your task is to evaluate the candidate based on structured categories ",
    });
    console.log(
      "Generated feedback:",
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment
    );
    const feedback = new Feedback({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
    });

    await feedback.save(); // Don't forget this line to persist it

    res.status(200).json({ messages: "Feedback saved to Db", data: feedback });
  } catch (error) {
    console.log(error);
  }
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
    const techStackArray = techstack.split(",").map((item) => item.trim());

    console.log("Parsed tech stack array:", techStackArray);
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

    // Parse the output
    let questions;
    try {
      questions = JSON.parse(questionsJson);
    } catch (jsonError) {
      // Fallback: Split plain text by newlines and clean up
      questions = questionsJson
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0); // Remove empty lines
    }

    if (!questions.every((q) => typeof q === "string")) {
      throw new Error("Not all questions are strings");
    }

    // Remove duplicates
    questions = [...new Set(questions)]; // Ensure unique questions

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
