import { Router } from "express";
import Blog from "../model/blog.js";
import Comment from "../model/comment.js";
const router = Router();

router.get("/", async (req, res) => {
  const ALL_BLOGS = await Blog.find({}).sort({ CreatedAt: "descending" });
  return res.render("blog", {
    user: req.user,
    Blogs: ALL_BLOGS,
  });
});

router.get("/create", (req, res) => {
  return res.render("createBlog", {
    user: req.user,
  });
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  return res.render("editBlog", {
    user: req.user,
    blog: blog
  });
});

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById({ _id: blogId }).populate("generatedBy");
    const ALL_COMMENTS = await Comment.find({ blogId: blogId })
      .populate("generatedBy")
      .sort({ CreatedAt: "desc" });
    return res.render("singleBlog", {
      user: req.user,
      blog,
      comments: ALL_COMMENTS,
    });
  } catch (error) {
    return res.render("singleBlog", {
      user: req.user,
      error,
    });
  }
});

router.post("/comment/:id", async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;
  await Comment.create({
    blogId: blogId,
    content: content,
    generatedBy: userId,
  });
  return res.redirect(`/blogs/${blogId}`);
});

export default router;
