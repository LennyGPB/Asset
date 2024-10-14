import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth"
import { prisma } from '@/lib/prisma'; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifiez si l'utilisateur est connecté
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized. You must be logged in to like an asset.' });
  }

  const { assetId } = req.body; 

  if (req.method === 'POST') {
    try {
      // Vérifiez si l'utilisateur a déjà liké cet asset
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_assetId: {
            userId: Number(session.user.id),
            assetId: Number(assetId),
          },
        },
      });

      if (existingLike) {
        // Si le like existe, le retirer
        await prisma.like.delete({
          where: {
            id: existingLike.id, // Assurez-vous que `id` existe dans votre modèle
          },
        });

        // Réduisez le compteur de likes de l'asset
        await prisma.asset.update({
          where: { id_asset: Number(assetId) },
          data: { likes: { decrement: 1 } },
        });

        return res.status(200).json({ message: 'Like removed successfully.' });
      } else {
        // Sinon, ajouter un nouveau like
        await prisma.like.create({
          data: {
            userId: Number(session.user.id),
            assetId: Number(assetId),
          },
        });

        // Augmentez le compteur de likes de l'asset
        await prisma.asset.update({
          where: { id_asset: Number(assetId) },
          data: { likes: { increment: 1 } },
        });

        return res.status(200).json({ message: 'Liked successfully.' });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Si la méthode n'est pas POST, retournez une erreur 405
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
