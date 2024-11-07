import type { NextApiRequest, NextApiResponse } from "next";
import { generateSASUrlForPrivateFile } from "@/lib/azureBlob";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { assetId, userId } = req.body;

  if (!assetId || !userId) { return res.status(400).json({ error: "Paramètres manquants" }); }

  try {
    // Vérifie si l'utilisateur possède l'asset (vérification d'achat)
    const buy = await prisma.buy.findFirst({
      where: { assetId: Number(assetId), userId: Number(userId) },
    });

    if (!buy) {
      return res.status(403).json({ error: "Accès refusé : cet utilisateur n'a pas acheté cet asset" });
    }

    // Récupère le nom du fichier associé à l'asset
    const asset = await prisma.asset.findUnique({
      where: { id_asset: Number(assetId) },
    });

    if (!asset || !asset.file_url) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }

    // Extraire le nom du blob du file_url
    const blobName = asset.file_url.split("/").pop();
    if (!blobName) {
      return res.status(400).json({ error: "Nom de fichier non valide" });
    }

    // Génère une URL SAS pour un téléchargement temporaire
    const downloadUrl = await generateSASUrlForPrivateFile(blobName);

    // Retourne le lien de téléchargement au client
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Erreur lors de la génération du lien de téléchargement :", error);
    res.status(500).json({ error: "Erreur lors de la génération du lien de téléchargement" });
  }
}
