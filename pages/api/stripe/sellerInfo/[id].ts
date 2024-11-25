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
  
      // Récupérer les informations du compte Stripe
      const account = await stripe.accounts.retrieve(user.stripeId);
  
      if (!account) {
        return res.status(404).json({ error: 'Stripe account not found.' });
      }
  
      // Vérifier les statuts du compte
      const chargesEnabled = account.charges_enabled;
      const payoutsEnabled = account.payouts_enabled;
  
      // Récupérer le solde du portefeuille
      const balance = await stripe.balance.retrieve({}, { stripeAccount: user.stripeId });
  
      // Récupérer la liste des paiements (ventes réalisées)
      const charges = await stripe.charges.list(
        { limit: 100 },
        { stripeAccount: user.stripeId }
      );
  
      // Générer un lien de connexion au tableau de bord Stripe
      const loginLink = await stripe.accounts.createLoginLink(user.stripeId);
  
      // Calculer les statistiques
      const numberOfSales = charges.data.length;
      const availableBalance = balance.available[0]?.amount || 0;
      const pendingBalance = balance.pending[0]?.amount || 0;
  
      // Réponse API
      res.status(200).json({
        chargesEnabled,
        payoutsEnabled,
        numberOfSales,
        availableBalance,
        pendingBalance,
        loginLink: loginLink.url,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations Stripe :', error);
      res.status(500).json({ error: 'Failed to retrieve seller info.' });
    }
  }
  