import type { NextApiRequest, NextApiResponse } from "next";
import upload from "@/lib/multer";
import { uploadFile } from "@/lib/s3"; // Importer la fonction upload vers S3
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Définition d'un type pour la requête avec les fichiers
export type NextApiRequestWithFiles = NextApiRequest & {
  files: {
    coverImage?: Express.Multer.File[];
    assetFile?: Express.Multer.File[];
    additionalFiles?: Express.Multer.File[];
  };
};

export default function handler( req: NextApiRequestWithFiles, res: NextApiResponse) {
  if (req.method === "POST") {
    upload.fields([ { name: "coverImage", maxCount: 1 }, { name: "assetFile", maxCount: 1 }, { name: "additionalFiles", maxCount: 7 } ])

    (req as any, res as any, async (err: unknown) => {
      if (err) 
      {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'upload" });
      }

      try 
      {

        const { titre, description, prix, slogan, categorieId, tagIds, userId } = req.body;
        const tagIdsArray = Array.isArray(tagIds)
          ? tagIds
              .map((id: string) => Number.parseInt(id, 10))
              .filter((id) => !isNaN(id))
          : tagIds
              .split(",")
              .map((id: string) => Number.parseInt(id.trim(), 10))
              .filter((id) => !isNaN(id));

        if ( !titre || !description || !prix || !slogan || !categorieId || !tagIds || !userId ) 
        {
          return res
            .status(400)
            .json({ error: "Tous les champs sont requis." });
        }

        const assetFile = req.files.assetFile ? req.files.assetFile[0] : null;
        const additionalFiles = req.files.additionalFiles;
        const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

        if (!additionalFiles) 
        {
          return res
            .status(400)
            .json({ error: "Au moins un fichier additionnel est requis." });
        }      
        
        if (!assetFile) {
          return res
            .status(400)
            .json({ error: "Le fichier principal est requis." });
        }

        const mediaData = additionalFiles.map((file: Express.Multer.File) => ({
          url: `/uploads/${file.filename}`, // L'URL du fichier uploadé
        }));

        // Upload de l'assetFile vers AWS S3
        //const uploadedAssetFile = await uploadFile(assetFile); // Retourne l'URL S3
        //const uploadedCoverImage = coverImage? await uploadFile(coverImage) : null;

        // Créer un nouvel asset 
        const newAsset = await prisma.asset.create({
          data: {
            titre,
            description,
            prix: Number.parseFloat(prix),
            slogan,
            file_url: `/uploads/${assetFile.filename}`,
            file_size: assetFile.size, 
            image_couverture: coverImage ? `http://localhost:3000/uploads/${coverImage.filename}` : null,
            categorie: { connect: { id_categorie: Number(categorieId) } },
            user: { connect: { id: Number(userId) } },
            medias: { create: mediaData },
          },
        });

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
        await prisma.assetTags.createMany({data: createData,});

        // -- ASSET CREE --
        res.status(200).json({ message: "Asset créé avec succès", asset: newAsset });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de l'asset" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
