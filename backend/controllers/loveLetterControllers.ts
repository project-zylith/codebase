import { Request, Response } from "express";
import { LoveLetterService } from "../src/services/loveLetterService";
import {
  CreateLoveLetterRequest,
  UpdateLoveLetterRequest,
} from "../src/types/loveLetter";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export const createLoveLetter = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { recipient, written_date, occasion, content, is_encrypted } =
      req.body;

    if (!recipient || !written_date || !occasion || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const loveLetterData: CreateLoveLetterRequest = {
      recipient,
      written_date,
      occasion,
      content,
      is_encrypted: is_encrypted || false,
    };

    const newLoveLetter = await LoveLetterService.create(
      req.user.id,
      loveLetterData
    );

    console.log("💌 Created love letter:", newLoveLetter);
    res.status(201).json(newLoveLetter);
  } catch (error) {
    console.error("❌ Error creating love letter:", error);
    res.status(500).json({ error: "Failed to create love letter" });
  }
};

export const getLoveLetters = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const loveLetters = await LoveLetterService.getByUserId(req.user.id);
    res.json(loveLetters);
  } catch (error) {
    console.error("❌ Error fetching love letters:", error);
    res.status(500).json({ error: "Failed to fetch love letters" });
  }
};

export const getLoveLetterById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const loveLetterId = parseInt(id);

    if (isNaN(loveLetterId)) {
      return res.status(400).json({ error: "Invalid love letter ID" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const loveLetter = await LoveLetterService.getById(
      loveLetterId,
      req.user.id
    );

    if (!loveLetter) {
      return res.status(404).json({ error: "Love letter not found" });
    }

    res.json(loveLetter);
  } catch (error) {
    console.error("❌ Error fetching love letter:", error);
    res.status(500).json({ error: "Failed to fetch love letter" });
  }
};

export const updateLoveLetter = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const loveLetterId = parseInt(id);
    const { recipient, written_date, occasion, content, is_encrypted } =
      req.body;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const updateData: UpdateLoveLetterRequest = {};
    if (recipient !== undefined) updateData.recipient = recipient;
    if (written_date !== undefined) updateData.written_date = written_date;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (content !== undefined) updateData.content = content;
    if (is_encrypted !== undefined) updateData.is_encrypted = is_encrypted;

    const updatedLoveLetter = await LoveLetterService.update(
      loveLetterId,
      req.user.id,
      updateData
    );

    if (!updatedLoveLetter) {
      return res.status(404).json({ error: "Love letter not found" });
    }

    console.log("💌 Updated love letter:", updatedLoveLetter);
    res.json(updatedLoveLetter);
  } catch (error) {
    console.error("❌ Error updating love letter:", error);
    res.status(500).json({ error: "Failed to update love letter" });
  }
};

export const deleteLoveLetter = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const loveLetterId = parseInt(id);

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const deleted = await LoveLetterService.delete(loveLetterId, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: "Love letter not found" });
    }

    console.log("💌 Deleted love letter with ID:", loveLetterId);
    res.json({ message: "Love letter deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting love letter:", error);
    res.status(500).json({ error: "Failed to delete love letter" });
  }
};

export const getOccasions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const occasions = await LoveLetterService.getOccasions(req.user.id);
    res.json(occasions);
  } catch (error) {
    console.error("❌ Error fetching occasions:", error);
    res.status(500).json({ error: "Failed to fetch occasions" });
  }
};
