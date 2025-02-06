"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
require("dotenv/config");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION = "ap-southeast-1" } = process.env;
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing.");
}
const s3Client = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
class ImgUpload {
    static uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileContent = req.file.buffer;
                const fileName = req.file.originalname;
                const bucketName = process.env.BUCKET_NAME;
                const fileSize = req.file.size;
                const fileType = req.file.mimetype;
                const region = process.env.AWS_REGION || "ap-southeast-1";
                if (!bucketName) {
                    throw new Error('Bucket name is not defined in the environment.');
                }
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: fileContent,
                    ContentType: fileType,
                });
                const MAX_SIZE = 10 * 1024 ** 2; // 10 MB
                if (fileSize > MAX_SIZE) {
                    return res.status(400).json({ error: "File size exceeds the 5MB limit." });
                }
                const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
                if (!ALLOWED_TYPES.includes(fileType)) {
                    return res.status(400).json({ error: "Invalid file type. Only JPEG, JPG, and PNG are allowed." });
                }
                yield s3Client.send(command);
                const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
                res.json({ message: "File uploaded successfully", fileUrl: fileUrl });
            }
            catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Error uploading file', details: error });
            }
        });
    }
}
exports.ImgUpload = ImgUpload;
