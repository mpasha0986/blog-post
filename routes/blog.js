import { Router } from "express";
import { handleCreateBlog, handleDeleteBlog, handleEditBlog } from "../controller/blog.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileSavePath = path.resolve("./public/uploads/");
    cb(null, fileSavePath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("coverImage"), handleCreateBlog);
router.get("/delete/:id", handleDeleteBlog);
router.post("/edit/:id", upload.single("coverImage"), handleEditBlog);

export default router;
