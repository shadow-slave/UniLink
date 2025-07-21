// server/models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Links to the post
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
