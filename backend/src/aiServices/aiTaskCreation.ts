import { GoogleGenerativeAI } from "@google/generative-ai";
const express = require("express");
import type { Request, Response } from "express";

const API_KEY = process.env.API_KEY as string;
const createTaskPrompt = `You are a helpful assistant that creates tasks for a user. You will be given a list of tasks that the user has completed. 
You will need to create a new task that is related to the task already defined by the user and not already in the list of tasks.`;

// I need to add a feature to the frontend form to allow the user to add a goal to the task
