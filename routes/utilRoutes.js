import { Router } from "express";
import { handleParaphrase, handleGenerateContent } from "../controller/blog.js";

const router = Router();

router.post("/paraphrase", handleParaphrase);
router.post("/generate", handleGenerateContent);

export default router;
