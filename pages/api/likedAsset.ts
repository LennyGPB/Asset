// pages/api/liked-assets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin d'importation est correct
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = Number(session.user.id);

  try {
    const likes = await prisma.like.findMany({
      where: {
        userId: userId,
      },
      include: {
        asset: true, // Inclure les assets associés
      },
    });

    const assetsLiked = likes.map(like => like.asset);
    return res.status(200).json(assetsLiked);
  } catch (error) {
    console.error('Error fetching liked assets:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
