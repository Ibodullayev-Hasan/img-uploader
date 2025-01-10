import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import "dotenv/config";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION = "ap-southeast-1" } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
	throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing.");
}

const s3Client = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

export class ImgUpload {
	static async uploadFile(req: Request | any, res: Response): Promise<any> {
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

			const command = new PutObjectCommand({
				Bucket: bucketName,
				Key: fileName,
				Body: fileContent,
				ContentType: fileType,
			});

			const MAX_SIZE = 10 * 1024 ** 2; // 5 MB
			if (fileSize > MAX_SIZE) {
				return res.status(400).json({ error: "File size exceeds the 5MB limit." });
			}

			const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
			if (!ALLOWED_TYPES.includes(fileType)) {
				return res.status(400).json({ error: "Invalid file type. Only JPEG, JPG, and PNG are allowed." });
			}

			await s3Client.send(command);

			const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

			res.json({ message: "File uploaded successfully", fileUrl: fileUrl });
		} catch (error) {
			console.error('Error uploading file:', error);
			res.status(500).json({ error: 'Error uploading file', details: error });
		}
	}
}
