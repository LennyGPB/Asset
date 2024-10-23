import { prisma } from "@/lib/prisma";
import AssetsList from "./AssetList";
// Importe le composant client

export default async function Page({ params }: { params: { id: string } }) {
  const categoryId = Number.parseInt(params.id); // Récupère l'ID de la catégorie

  const assets = await prisma.asset.findMany({
    where: {
      categorieId: categoryId,
    },
    include: {
      categorie: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Convertir les `Decimal` en `number` et simplifier la structure des `tags`
  const assetsWithTransformedTags = assets.map(asset => ({
    ...asset,
    prix: Number(asset.prix), // Conversion de Decimal en number
    tags: asset.tags.map(tagRelation => tagRelation.tag), // Extraire uniquement le `tag`
  }));

  const tags = await prisma.tags.findMany({
    where: {
      categorieId: categoryId, // Filtre par catégorie
    },
  });

  const categorie = await prisma.categorie.findUnique({
    where: {
      id_categorie: categoryId,
    },
  });

  return <AssetsList assets={assetsWithTransformedTags} tags={tags} categorie={categorie?.nom ?? ''} />;
}
