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
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { assetId, userId } = req.body;

    if (!assetId || !userId) {
      console.error("Erreur : ID de l'asset ou de l'utilisateur manquant");
      return res.status(400).json({ error: "Missing assetId or userId" });
    }

    try {
      // Récupérer l'asset et l'account associé avec le stripeId
      const asset = await prisma.asset.findUnique({
        where: { id_asset: Number(assetId) },
        include: {
          user: {
            include: {
              accounts: true, // Inclut tous les comptes associés à l'utilisateur
            },
          },
        },
      });

      if (!asset || !asset.user?.accounts) {
        return res.status(404).json({ error: 'Asset or seller account not found' });
      }

      // Trouver le compte Stripe du vendeur
      const stripeAccount = asset.user.accounts[0]; 

      if (!stripeAccount || !stripeAccount.providerAccountId) {
        return res.status(404).json({ error: 'Seller Stripe account not found' });
      }

      // Créer une session de paiement Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: asset.titre,
              },
              unit_amount: Math.round(Number(asset.prix) * 100), // Stripe gère les prix en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://assets-store.fr/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          assetId: assetId,  // Sauvegarder l'assetId pour référence future
          userId: userId,    // Sauvegarder l'userId
        },
        payment_intent_data: {
          transfer_data: {
            destination: stripeAccount.providerAccountId, // ID Stripe Connect du vendeur
          },
          application_fee_amount: Math.round(Number(asset.prix) * 100 * 0.12), 
        },
      });

      console.log("Session Stripe créée avec succès :", session.url);
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

