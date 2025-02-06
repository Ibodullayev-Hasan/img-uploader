import { Router } from "express";
import multer from "multer";
import { ImgUpload } from "../controllers"; // ImgUpload va uploadni import qilamiz

let router: Router = Router()

// Multerni sozlash
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Faylni yuklash uchun POST endpoint
router.post('/upload', upload.single('file'), ImgUpload.uploadFile);

export default router;
