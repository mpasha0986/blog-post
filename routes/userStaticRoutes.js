import { Router } from "express";
import User from "../model/user.js";
import Blog from "../model/blog.js";

const router = Router();

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id); // Assuming `req.user` is populated by auth middleware
    const blogs = await Blog.find({ generatedBy: req.user._id });

    if (!user) throw new Error("User not found");
  
    return res.render("profile", {
      user: req.user,
      blogs: blogs,
    });
  } catch (error) {
    res.status(400).render("profile", {
      message: error.message,
    });
  }
}

async function getEditProfile(req, res) {
  try {
    const user = await User.findById(req.user._id); // Assuming `req.user` is populated by auth middleware
    if (!user) throw new Error("User not found");

    return res.render("editProfile", {
      user: req.user,
    });
  } catch (error) {
    res.status(400).render("editProfile", {
      message: error.message,
    });
  }
}

export default router;

export { getUserProfile, getEditProfile };
