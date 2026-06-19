import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoConnection from "./connection.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import blogStaticRoutes from "./routes/blogStaticRoutes.js";
import userStaticRoutes from "./routes/userStaticRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { checkForAuthentication } from "./middleware/auth.js";
const app = express();

// ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

// connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/blogify";
mongoConnection(MONGODB_URI)
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) => console.log("Error Connecting To MongoDB", err.message));

// static routes
app.get("/", (req, res) => res.redirect("/blogs"));
app.use("/blogs", checkForAuthentication, blogStaticRoutes);
app.use("/user", checkForAuthentication, userStaticRoutes);

// routes
app.use("/blogs", checkForAuthentication, blogRoutes);
app.use("/user", userRoutes);

// global error handler — never leave a request hanging on a blank page
app.use((err, req, res, next) => {
  console.log("Unhandled error:", err.message);
  res.status(500).send("Something went wrong. Please try again later.");
});

// server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Connnected To Server on port ${PORT}`));
