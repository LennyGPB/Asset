import multer from "multer";
import path from "node:path";
import type { Request } from "express"; // Importez Request de express

const storage = multer.diskStorage({
  // Fonction pour déterminer le dossier où les fichiers seront stockés
  destination: (
    req: Request, // Utilisez Request d'Express
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(process.cwd(), "public/uploads")); // Dossier où les fichiers seront stockés
  },

  // Fonction pour déterminer le nom des fichiers téléchargés
  filename: (
    req: Request, // Utilisez Request d'Express
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Renommer le fichier pour éviter les conflits, par exemple en ajoutant la date actuelle au nom du fichier
    cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
  },
});

// Middleware Multer prêt à être utilisé dans les routes API
const upload = multer({ storage });

export default upload;
