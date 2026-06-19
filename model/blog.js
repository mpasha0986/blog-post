import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImageUrl: {
      type: String,
      default: "./images/blog.jpg",
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

export default Blog;
