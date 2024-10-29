import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "@/lib/prisma"; 
import stripe from '@/lib/stripe';  

export const config = {
  api: {
    bodyParser: true,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { assetId, userId } = req.body;

    if (!assetId || !userId) {
      console.error("Erreur : ID de l'asset ou de l'utilisateur manquant");
      return res.status(400).json({ error: "Missing assetId or userId" });
    }


    try {
      // Récupérer l'asset à acheter dans la base de données
      const asset = await prisma.asset.findUnique({
        where: { id_asset: Number(assetId) },
      });

      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
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
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          assetId: assetId,  // Sauvegarder l'assetId pour référence future
          userId: userId,    // Sauvegarder l'userId
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
