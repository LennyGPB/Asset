import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20' as any,
  });
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid or missing userId.' });
    }
  
    try {
      // Récupération de l'utilisateur via Prisma
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
  
      if (!user || !user.stripeId) {
        return res.status(404).json({ error: 'User not found or Stripe account not configured.' });
      }
  
      console.log('Utilisateur trouvé avec stripeId :', user.stripeId);
  
      // Créer un lien de connexion au tableau de bord Stripe
      const loginLink = await stripe.accounts.createLoginLink(user.stripeId);
  
      if (!loginLink || !loginLink.url) {
        return res.status(500).json({ error: 'Failed to create login link for Stripe dashboard.' });
      }
  
      // Réponse avec uniquement le lien
      res.status(200).json({ loginLink: loginLink.url });
    } catch (error: any) {
      console.error('Erreur lors de la récupération du lien Stripe Dashboard :', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve login link.' });
    }
  }