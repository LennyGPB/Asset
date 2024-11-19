import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid query' });
  }

  try {
    // Requête de recherche dans Prisma
    const assets = await prisma.asset.findMany({
      where: {
        OR: [
            { titre: { contains: query }},
            { description: { contains: query}},
          ],
      },
      take: 10,
    });

    return res.status(200).json(assets);
  } catch (error) {
    console.error('Error searching assets:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
