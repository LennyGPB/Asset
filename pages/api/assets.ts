// pages/api/assets.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { categoryId } = req.query;
    
    const assets = await prisma.asset.findMany({
        where: {
            categorieId: Number(categoryId),
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

    // Extraire les tags
    const tags = assets.flatMap(asset => asset.tags.map(tagRelation => tagRelation.tag));
    
    res.status(200).json({ assets, tags });
}
