import { GoogleGenerativeAI } from "@google/generative-ai";
const express = require("express");
import type { Request, Response } from "express";

const API_KEY = process.env.API_KEY as string;

const promptDevelopInsight = `I am using you inside on a todo list app, that allows users to enter a task and have 
it displayed on the screen as well as click on the goal to complete it. You will receive a goal from an array of goals that a 
user plans to complete. Your job is to return an insight based on the goal that will then be used in another prompt 
to form a paragraph or two summary based on the size of the array of insights. Each insight should be about a 
sentence. Return your response as a JSON object with the key: "response" and value: "YourInsight", heres an example:
    {
        "response": "Original: "Whatever the task provided was", Insight: "User is planning to throw out the trash" 
    }
`;

const promptProvideFinalInsight = `You will be passed an array of information based on the goals a user has set on a todo app. This array will have information regarding the original goal 
as well as insights from an AI. Create a 1 - 3 paragraph breakdown of goals that work in tandem if there are any, i.e. Goal 1: Go to the gym more Goal 2: Eat Healthier. If there aren't any suggest goals that can help bridge the gap. 
Overall your response should provide next steps a user can take to achieve their goals and ideas that resonate with their goals such as, "reading a article on nutrition has lead more people to complete goals similar to yours. Your response should be a JSON object like this, 
    {
        "response": "your response..."
    } "`;

const genAI = new GoogleGenerativeAI(API_KEY);

export const insights = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Initializing Gemini model...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      promptDevelopInsight,
      req.body.goal
    );
    const response = await result.response.text();

    res.status(200).send({ result: response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating daily challenges" });
  }
};

export const finalInsight = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Initializing Gemini model...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      promptProvideFinalInsight,
      req.body.insights
    );
    const response = await result.response.text();

    res.status(200).send({ result: response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating daily challenges" });
  }
};
