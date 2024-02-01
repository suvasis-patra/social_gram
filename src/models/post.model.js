import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter a title"],
    },
    caption: {
      type: String,
      required: [ture, "Caption required"],
    },
    tags: [{ type: String }],
    imageUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
