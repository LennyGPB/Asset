import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro'; // Nécessaire pour lire la requête en buffer
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia', // Version de l'API Stripe
  });

// Désactive le bodyParser pour cette route spécifique
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req); // Lit la requête en buffer
    const sig = req.headers['stripe-signature']; // Récupère la signature Stripe

    let event: Stripe.Event;

    try {
      // Vérifie que l'événement est bien envoyé par Stripe
      event = stripe.webhooks.constructEvent(buf, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
      console.error('⚠️ Erreur de vérification de la signature du webhook.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extraire les métadonnées nécessaires
      const assetId = session.metadata?.assetId;
      const userId = session.metadata?.userId;

      // Ajouter l'asset à l'utilisateur dans la base de données
      try {
        await prisma.buy.create({
          data: {
            userId: Number(userId),
            assetId: Number(assetId),
          },
        });

        // Mettre à jour le nombre de téléchargements de l'asset
        await prisma.asset.update({
          where: { id_asset: Number(assetId) },
          data: { nb_dl: { increment: 1 } },
        });

        res.status(200).json({ received: true });
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la possession de l’utilisateur:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la possession de l’utilisateur' });
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
