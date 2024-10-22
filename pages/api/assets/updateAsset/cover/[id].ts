import upload from "@/lib/multer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { NextApiRequest, NextApiResponse } from "next";

export type NextApiRequestWithFiles = NextApiRequest & {
    file?: Express.Multer.File; 
};

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser par défaut pour gérer le fichier avec Multer
  },
};

export default async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
    if (req.method === "PUT") {

        const session = await getServerSession(req, res, authOptions); 
        
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (session.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        
        upload.single("assetUpdateCover")(req as any, res as any, async (err: unknown) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erreur lors de l'upload" });
            }

            const { id } = req.query;
            const assetUpdateCover = req.file;

            if (!assetUpdateCover) {
                return res.status(400).json({ error: "Aucun fichier n'a été uploadé." });
            }

            try {

                const existingAsset = await prisma.asset.findUnique({
                    where: { id_asset: Number(id) },
                });

                if (!existingAsset) {
                    return res.status(404).json({ error: "Asset non trouvé" });
                }

                if (Number(session.user.id) !== Number(existingAsset.userId)) {
                    return res.status(401).json({ error: "Non autorisé" });
                }

                const asset = await prisma.asset.update({
                    where: { id_asset: Number(id) },
                    data: {
                        image_couverture: `/uploads/${assetUpdateCover.filename}`,
                    },
                });

                res.status(200).json({ asset });

            } catch (error) {
                console.error("Error updating asset cover:", error);
                return res.status(500).json({ error: "Erreur lors de la mise à jour de la couverture" });
            }
        });

    }
}
