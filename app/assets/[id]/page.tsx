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
    } ,
  });

  const tags = await prisma.tags.findMany({
    where: {
      categorieId: categoryId, // Filtre par catégorie
    },
  })  ;


  const assetTags = assets.flatMap(asset => asset.tags.map(tagRelation => tagRelation.tag));

  return <AssetsList assets={assets} tags={tags} />;
}
