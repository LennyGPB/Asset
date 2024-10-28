import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  try {
    // Récupérer l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user || user.role !== 'vendeur') {
      return res.status(400).json({ error: 'User must have the seller role to create a Stripe account' });
    }

    // Créer un compte Stripe Express
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR', // À adapter selon le pays du vendeur
      email: user.email || undefined,
      capabilities: {
        transfers: { requested: true },
      },
    });

    // Enregistrer l'ID du compte Stripe dans la base de données
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { stripeId: account.id },
    });

    return res.status(200).json({ accountId: account.id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
