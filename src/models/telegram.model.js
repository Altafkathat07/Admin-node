import mongoose, { Schema } from "mongoose";

const telegramSchema = new Schema(
  {
    telegram: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Telegram = mongoose.model("Telegram", telegramSchema);
