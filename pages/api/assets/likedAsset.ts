// pages/api/liked-assets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = Number(session.user.id);

  try {
    const likes = await prisma.likes.findMany({
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
