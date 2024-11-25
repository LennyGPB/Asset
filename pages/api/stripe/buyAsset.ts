import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "@/lib/prisma"; 
import stripe from '@/lib/stripe';  
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth"; 
import { redirect } from 'next/dist/server/api-utils';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      console.error("Erreur : Utilisateur non authentifié");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { assetId, userId } = req.body;

    if (!assetId || !userId) {
      console.error("Erreur : ID de l'asset ou de l'utilisateur manquant", { assetId, userId });
      return res.status(400).json({ error: "Missing assetId or userId" });
    }

    try {
      const asset = await prisma.asset.findUnique({
        where: { id_asset: Number(assetId) },
        include: {
          user: true, // Inclut directement l'utilisateur
        },
      });

      if (!asset) {
        console.error("Erreur : Asset introuvable pour ID :", assetId);
        return res.status(404).json({ error: "Asset not found" });
      }

      if (!asset.user?.stripeId) {
        console.error("Erreur : stripeId invalide ou non configuré pour l'utilisateur :", asset.user?.id);
        return res.status(404).json({ error: "Seller Stripe account is not valid or not configured." });
      }

      const stripeId = asset.user.stripeId;

      // Vérifier si le compte Stripe du vendeur est activé pour les paiements
      const account = await stripe.accounts.retrieve(stripeId);
      if (!account.charges_enabled) {
        console.error("Erreur : Le compte Stripe du vendeur n'est pas activé :", stripeId);
        return res.status(400).json({ error: "Seller Stripe account is not enabled for charges." });
      }

      // Créer une session Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: asset.titre,
              },
              unit_amount: Math.round(Number(asset.prix) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://assets-store.fr/profil/${asset.user.id}/buy`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          assetId: assetId,
          userId: userId,
        },
        payment_intent_data: {
          transfer_data: {
            destination: stripeId, // Utilisation directe du stripeId
          },
          application_fee_amount: Math.round(Number(asset.prix) * 100 * 0.12), // Commission de 12%
        },
      });

      console.log("Session Stripe créée avec succès :", session.url);

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe :', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    console.error(`Méthode ${req.method} non autorisée`);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
