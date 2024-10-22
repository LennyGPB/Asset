import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const popularAssets = await prisma.asset.findMany({
      orderBy: {
        likes: 'desc',
      },
      take: 3,
    });

    return res.status(200).json(popularAssets);
  } catch (error) {
    console.error('Error fetching popular assets:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
