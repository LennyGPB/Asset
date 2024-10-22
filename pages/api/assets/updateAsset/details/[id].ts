import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import upload from "@/lib/multer";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {

      const { id } = req.query;
      const { titre, description, prix, slogan, userId } = req.body;
      const session = await getServerSession(req, res, authOptions);

      const existingAsset = await prisma.asset.findUnique({
        where: { id_asset: Number(id) },
      });
    
      if (!existingAsset) {
        return res.status(404).json({ error: "Asset non trouvé" });
      }

      if (!session) {
        return res.status(401).json({ error: "Non autorisé : vous devez être connecté" });
      }
    
      // Vérifie si l'utilisateur est admin ou si son ID correspond
      if (session.user.role !== "admin" && Number(session.user.id) !== Number(existingAsset.userId)) {
          return res.status(401).json({ error: "Non autorisé" });
      }

      try {

        const asset = await prisma.asset.update({
        where: { id_asset: Number(id) },
        data: {
          titre,
          description,
          prix: Number.parseFloat(prix),
          slogan,
          userId,
        },
      });

      res.status(200).json(asset);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'asset" });
      }
  } else {  
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}

