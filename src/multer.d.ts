import { Request } from 'express';

// Multer bilan yuklangan faylni to'g'ri tipga o'zgartiramiz
declare global {
  namespace Express {
    interface Request {
      file: Express.Multer.File; // Multer fayli
    }
  }
}
