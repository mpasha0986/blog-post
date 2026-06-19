import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureURL: {
    type: String,
    default: "/images/default.jpg",
  },
  bio: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "NORMAL",
    enum: ["NORMAL", "ADMIN"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) return;
  return await bcrypt.compare(password, user.password);
});

const User = model("user", userSchema);

export default User;
