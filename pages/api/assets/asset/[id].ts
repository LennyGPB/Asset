import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) 
{
  const { id } = req.query;

  const asset = await prisma.asset.findUnique({
    where: {
      id_asset: Number(id),
    },
    include: {
      categorie: true,
      tags: {
        include: {
          tag: true,
        },
      },
      medias: true,
      user: true,
    },
  });

  res.status(200).json({ asset });
}
