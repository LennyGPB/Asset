import upload from "@/lib/multer";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export type NextApiRequestWithFiles = NextApiRequest & {
    file?: Express.Multer.File; // Pour un seul fichier
};

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser par défaut pour gérer le fichier avec Multer
  },
};

  
export default async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
  if (req.method === "PUT") {

    console.log("Request received to update asset");
    
    upload.single("assetUpdateFile")(req as any, res as any, async (err: unknown) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'upload" });
      }

      const { id } = req.query;
      const assetUpdateFile = req.file;

        if (!assetUpdateFile) {
          return res.status(400).json({ error: "Aucun fichier n'a été uploadé." });
        }

      try {

        const existingAsset = await prisma.asset.findUnique({
          where: { id_asset: Number(id) },
        });

        if (!existingAsset) {
          return res.status(404).json({ error: "Asset non trouvé" });
        }

        const asset = await prisma.asset.update({
          where: { id_asset: Number(id) },
          data: {
            file_url: `/uploads/${assetUpdateFile.filename}`,
          },
        });

        res.status(200).json({ asset });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du fichier" });
      }
    });
  }
}