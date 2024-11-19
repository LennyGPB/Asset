import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20' as any,
  });
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user || !user.stripeId) {
      return res.status(404).json({ error: 'User not found or not a seller.' });
    }

    // Récupérer le solde du portefeuille
    const balance = await stripe.balance.retrieve({}, { stripeAccount: user.stripeId });

    // Récupérer la liste des paiements (ventes réalisées)
    const charges = await stripe.charges.list(
        { limit: 100 },
        { stripeAccount: user.stripeId }
      );

    const loginLink = await stripe.accounts.createLoginLink(user.stripeId);

    const numberOfSales = charges.data.length;
    const availableBalance = balance.available[0]?.amount || 0;
    const pendingBalance = balance.pending[0]?.amount || 0;

    // Réponse API
    res.status(200).json({
      numberOfSales,
      availableBalance,
      pendingBalance,
      loginLink: loginLink.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve seller info.' });
  }
}
