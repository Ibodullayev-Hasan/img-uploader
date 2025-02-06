"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers"); // ImgUpload va uploadni import qilamiz
let router = (0, express_1.Router)();
// Multerni sozlash
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// Faylni yuklash uchun POST endpoint
router.post('/upload', upload.single('file'), controllers_1.ImgUpload.uploadFile);
exports.default = router;
