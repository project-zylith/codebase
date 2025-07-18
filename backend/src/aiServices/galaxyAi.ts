import { GoogleGenerativeAI } from "@google/generative-ai";
const express = require("express");
import type { Request, Response } from "express";

const API_KEY = process.env.API_KEY as string;

const generateGalaxyPrompt = `You are an AI agent inside of a note taking/todo app. Your job is to create a "galaxy", which is a collection of notes the user has created. You will be provided all of the notes with their title and content inside of a nested array. ([[title, content], [title, content], [title, content], ...]) You will need to create a nested array containing your suggested name for the grouping, i.e. "cooking" that pertains to the notes you've added to that group. 
([[name, [[title, content], [title, content], [title, content], ...]], [name, [[title, content], [title, content], [title, content], ...]], [name, [[title, content], [title, content], [title, content], ...]], ...]). Which I will be used to render in the app, each group will be a tab in the app.`;
const galaxyReSortPrompt = ``;
const generateGalaxyInsightPrompt = ``;
const generateGalaxyInsightAllPrompt = ``;
