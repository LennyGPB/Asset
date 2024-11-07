import type { NextApiRequest, NextApiResponse } from "next";
import upload from "@/lib/multer";
import { uploadPublicFile, uploadPrivateFile } from "@/lib/azureBlob";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export type NextApiRequestWithFiles = NextApiRequest & {
  files: {
    coverImage?: Express.Multer.File[];
    assetFile?: Express.Multer.File[];
    additionalFiles?: Express.Multer.File[];
  };
};

export default async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "assetFile", maxCount: 1 },
    { name: "additionalFiles", maxCount: 7 },
  ])(req as any, res as any, async (err: unknown) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de l'upload" });
    }

    try {
      const { titre, description, prix, slogan, categorieId, tagIds, userId, urlYoutube } = req.body;

      const tagIdsArray = Array.isArray(tagIds)
        ? tagIds.map((id: string) => Number.parseInt(id, 10)).filter((id: number) => !isNaN(id))
        : tagIds.split(",").map((id: string) => Number.parseInt(id.trim(), 10)).filter((id: number) => !isNaN(id));

      if (!titre || !description || !prix || !slogan || !categorieId || !tagIds || !userId) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      const assetFile = req.files.assetFile ? req.files.assetFile[0] : null;
      const additionalFiles = req.files.additionalFiles || [];
      const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

      if (!assetFile || !additionalFiles.length) {
        return res.status(400).json({ error: "Le fichier principal et au moins un fichier additionnel sont requis." });
      }

      // Upload de l'assetFile vers le conteneur privé
      const uploadedAssetFileUrl = await uploadPrivateFile({
        originalname: assetFile.originalname,
        buffer: assetFile.buffer,
        mimetype: assetFile.mimetype,
      });

      // Upload de l'image de couverture vers le conteneur public (si présente)
      const uploadedCoverImageUrl = coverImage
        ? await uploadPublicFile({
            originalname: coverImage.originalname,
            buffer: coverImage.buffer,
            mimetype: coverImage.mimetype,
          })
        : null;

      // Upload des fichiers additionnels vers le conteneur public
      // const mediaData = await Promise.all(
      //   additionalFiles.map(async (file) => {
      //     const url = await uploadPublicFile({
      //       originalname: file.originalname,
      //       buffer: file.buffer,
      //       mimetype: file.mimetype,
      //     });
      //     return { url };
      //   })
      // );

      // Créer un nouvel asset dans la base de données avec les URLs d'Azure
      const newAsset = await prisma.asset.create({
        data: {
          titre,
          description,
          prix: Number.parseFloat(prix),
          slogan,
          file_url: uploadedAssetFileUrl, // URL de l'asset principal stocké en privé
          file_size: assetFile.size,
          image_couverture: uploadedCoverImageUrl, // URL de l'image de couverture stockée en public
          categorie: { connect: { id_categorie: Number(categorieId) } },
          user: { connect: { id: Number(userId) } },
         // medias: { create: mediaData }, // URLs des fichiers additionnels stockés en public
        },
      });

      const mediaPromises = additionalFiles.map(async (file) => {
        const url = await uploadPublicFile({
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
        });
        const media = await prisma.medias.create({
          data: { url },
        });
        return { mediaId: media.id_media, assetId: newAsset.id_asset };
      });

      const mediaLinks = await Promise.all(mediaPromises);

      if (urlYoutube){
        const lienyoutube = await prisma.medias.create({
          data: { url: urlYoutube },
        });

        await prisma.assetMedia.create({
          data: {
            assetId: newAsset.id_asset,
            mediaId: lienyoutube.id_media,
          },
        });
      }

      // Enregistre les liens dans la table AssetMedia
      await prisma.assetMedia.createMany({
        data: mediaLinks,
      });

      // Enregistrement dans la table Possession pour l'utilisateur
      await prisma.possession.create({
        data: {
          userId: Number(userId),
          assetId: newAsset.id_asset,
        },
      });

      const createData = tagIdsArray.map((tagId: number) => ({
        assetId: newAsset.id_asset,
        tagId,
      }));
      await prisma.assetTags.createMany({ data: createData });

      // Réponse de succès
      res.status(200).json({ message: "Asset créé avec succès", asset: newAsset });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de l'asset" });
    }
  });
}
