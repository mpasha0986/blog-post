import { Router } from "express";
import Blog from "../model/blog.js";
import Comment from "../model/comment.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const ALL_BLOGS = await Blog.find({})
      .populate("generatedBy")
      .sort({ createdAt: "descending" });
    return res.render("blog", {
      user: req.user,
      Blogs: ALL_BLOGS,
    });
  } catch (error) {
    // DB unavailable (e.g. missing MONGODB_URI) — still render the page.
    console.log("Error loading blogs:", error.message);
    return res.render("blog", {
      user: req.user,
      Blogs: [],
    });
  }
});

router.get("/create", (req, res) => {
  if (!req.user) return res.redirect("/user/login");
  return res.render("createBlog", {
    user: req.user,
  });
});

router.get("/edit/:id", async (req, res) => {
  if (!req.user) return res.redirect("/user/login");
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return res.redirect("/blogs");
  // Only the author can open the edit page for their own blog.
  if (String(blog.generatedBy) !== String(req.user._id)) {
    return res.status(403).send("You are not allowed to edit this blog.");
  }
  return res.render("editBlog", {
    user: req.user,
    blog: blog,
  });
});

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById({ _id: blogId }).populate("generatedBy");
    const ALL_COMMENTS = await Comment.find({ blogId: blogId })
      .populate("generatedBy")
      .sort({ createdAt: "desc" });
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
  if (!req.user) return res.redirect("/user/login");
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
