import User from "../model/user.js";
import { createToken } from "../utils/auth.js";
import Blog from "../model/blog.js";

async function handleUserSignUp(req, res) {
  const { fullName, username, email, password, bio } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) throw new Error("User Already Exists with this Email");
    const user = await User.create({
      fullName,
      username,
      email,
      password,
      bio,
      profilePictureURL:
        req.file && `/uploads/profilePictures/${req.file.filename}`,
    });

    if (!user) throw new Error("Could not create User");
    return res.redirect("/user/login");
  } catch (error) {
    return res.render("signup", {
      error,
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) throw new Error("User Don't Exist with this Email");
    const decodePassword = await User.matchPassword(email, password);
    if (!decodePassword) throw new Error("Wrong Password, Try Again");
    const token = createToken(userExist);
    res.cookie("token", token);
    return res.redirect("/blogs");
  } catch (error) {
    return res.render("login", {
      error,
    });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/blogs");
}

async function handleDeleteAccount(req, res) {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    await Blog.deleteMany({ generatedBy: userId });
    res.clearCookie("token");
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).json({ message: "Error deleting account" });
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const blogs = await Blog.find({ generatedBy: id });
    res.render("profile", { user, blogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleDeleteAccount,
};
