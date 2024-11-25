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
      // Log avant la récupération de l'asset
      console.log("Recherche de l'asset avec ID :", assetId);

      const asset = await prisma.asset.findUnique({
        where: { id_asset: Number(assetId) },
        include: {
          user: {
            include: {
              accounts: true, // Inclut les comptes associés
            },
          },
        },
      });

      // Log après récupération de l'asset
      console.log("Asset récupéré :", asset);

      if (!asset) {
        console.error("Erreur : Asset introuvable pour ID :", assetId);
        return res.status(404).json({ error: "Asset not found" });
      }

      if (!asset.user || !asset.user.accounts.length) {
        console.error("Erreur : Aucun compte lié pour l'utilisateur :", asset.user?.id);
        return res.status(404).json({ error: "Seller account not found" });
      }

      // Log avant la récupération du compte Stripe
      const stripeAccount = asset.user.accounts[0];
      console.log("Compte Stripe récupéré :", stripeAccount);

      if (!stripeAccount || !stripeAccount.providerAccountId) {
        console.error("Erreur : Compte Stripe introuvable pour l'utilisateur :", asset.user.id);
        return res.status(404).json({ error: "Seller Stripe account not found" });
      }

      // Log avant la création de la session Stripe
      console.log("Création de la session Stripe...");

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
        success_url: `https://assets-store.fr/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          assetId: assetId,
          userId: userId,
        },
        payment_intent_data: {
          transfer_data: {
            destination: stripeAccount.providerAccountId,
          },
          application_fee_amount: Math.round(Number(asset.prix) * 100 * 0.12),
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
