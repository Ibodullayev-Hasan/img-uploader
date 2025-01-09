import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import "dotenv/config";

// AWS konfiguratsiyasi
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION = "ap-southeast-1" } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
	throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing.");
}

// S3 client ni yaratish
const s3Client = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

// Fayl yuklash uchun controller
export class ImgUpload {
	static async uploadFile(req: Request | any, res: Response): Promise<any> {
		try {
			const fileContent = req.file.buffer;  // Multerdan faylni olish
			const fileName = req.file.originalname;
			const bucketName = process.env.BUCKET_NAME;  // .env faylidan bucket nomini olish
			const region = process.env.AWS_REGION || "ap-southeast-1"; // Regionni environment variabledan olish

			if (!bucketName) {
				throw new Error('Bucket name is not defined in the environment.');
			}

			// Faylni S3 ga yuklash
			const command = new PutObjectCommand({
				Bucket: bucketName,
				Key: fileName,
				Body: fileContent,
			});

			const data = await s3Client.send(command);

			// Fayl URLni yaratish
			const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

			// URLni javob sifatida yuborish
			res.json({ message: "File uploaded successfully", fileUrl: fileUrl });
		} catch (error) {
			console.error('Error uploading file:', error);
			res.status(500).json({ error: 'Error uploading file', details: error });
		}
	}
}
