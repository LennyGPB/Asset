// pages/api/assets.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        categorie: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json({ assets });
  } catch (error) {
    res.status(500).json({ error: "Error fetching assets" });
  }
}
