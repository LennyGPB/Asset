import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assetId } = req.query;

  try {
    const asset = await prisma.asset.findUnique({
      where: { id_asset: Number(assetId) },
      select: { likes: true },
    });

    if (!asset) {
      return res.status(404).json({ error: 'Asset non trouvé' });
    }

    res.status(200).json({ likes: asset.likes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des likes' });
  }
}
