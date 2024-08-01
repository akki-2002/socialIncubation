import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: String,
    likes: [],


    comments: [
      {
        userId: String,
        username: String,
        text: String,
        createdAt: { type: Date, default: new Date() },
      },
    ],


    image: String,
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);
export default PostModel;