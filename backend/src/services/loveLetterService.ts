import {
  LoveLetter,
  CreateLoveLetterRequest,
  UpdateLoveLetterRequest,
} from "../types/loveLetter";
const knex = require("../../database/database");

export class LoveLetterService {
  static async create(
    userId: number,
    data: CreateLoveLetterRequest
  ): Promise<LoveLetter> {
    const [loveLetter] = await knex("love_letters")
      .insert({
        user_id: userId,
        recipient: data.recipient,
        written_date: data.written_date,
        occasion: data.occasion,
        content: data.content,
        is_encrypted: data.is_encrypted || false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return loveLetter;
  }

  static async getByUserId(userId: number): Promise<LoveLetter[]> {
    return await knex("love_letters")
      .where("user_id", userId)
      .orderBy("written_date", "desc");
  }

  static async getById(id: number, userId: number): Promise<LoveLetter | null> {
    const [loveLetter] = await knex("love_letters")
      .where({ id, user_id: userId })
      .limit(1);

    return loveLetter || null;
  }

  static async update(
    id: number,
    userId: number,
    data: UpdateLoveLetterRequest
  ): Promise<LoveLetter | null> {
    const [updatedLoveLetter] = await knex("love_letters")
      .where({ id, user_id: userId })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning("*");

    return updatedLoveLetter || null;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const deletedCount = await knex("love_letters")
      .where({ id, user_id: userId })
      .del();

    return deletedCount > 0;
  }

  static async getOccasions(userId: number): Promise<string[]> {
    const occasions = await knex("love_letters")
      .where("user_id", userId)
      .distinct("occasion")
      .pluck("occasion");

    return occasions;
  }
}
