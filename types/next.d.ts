// types/next.d.ts
import { NextApiRequest } from "next";
import multer from "multer";

declare module "next" {
  interface NextApiRequest {
    files: {
      [key: string]: Multer.File[]; // Utilisation de Multer.File pour typage
    };
  }
}
