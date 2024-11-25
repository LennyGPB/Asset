import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      if (session.user.role !== "admin") {
          return res.status(403).json({ error: "Forbidden" });
      }
      
      try {
          const { id } = req.query;

          // Mettre à jour le rôle de l'utilisateur en "seller"
          const updatedUser = await prisma.user.update({
              where: { id: Number(id) },
              data: { role: "seller" },
          });

          // Créer un compte Stripe Standard pour l'utilisateur
          const account = await stripe.accounts.create({
              type: 'standard', // Type de compte standard
              country: 'FR', // Adapter selon le pays
              email: updatedUser.email || undefined, // Utiliser l'email de l'utilisateur
          });

          // Enregistrer l'ID du compte Stripe dans la base de données
          await prisma.user.update({
              where: { id: Number(id) },
              data: { stripeId: account.id },
          });

          // Stripe gère l'envoi des instructions par email pour configurer le compte
          return res.status(200).json({
              message: `Stripe Standard account created. The seller should check their email (${updatedUser.email}) for further instructions.`,
          });
      } catch (error) {
          console.error("Error updating user or creating Stripe account:", error);
          res.status(500).json({ error: "Failed to update user or create Stripe account" });
      }
  } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { userId } = req.body;

//   try {
//     // Récupérer l'utilisateur dans la base de données
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!user || user.role !== 'vendeur') {
//       return res.status(400).json({ error: 'User must have the seller role to create a Stripe account' });
//     }

//     // Créer un compte Stripe Express
//     const account = await stripe.accounts.create({
//       type: 'express',
//       country: 'FR', // À adapter selon le pays du vendeur
//       email: user.email || undefined,
//       capabilities: {
//         transfers: { requested: true },
//       },
//     });

//     // Enregistrer l'ID du compte Stripe dans la base de données
//     await prisma.user.update({
//       where: { id: Number(userId) },
//       data: { stripeId: account.id },
//     });

//     return res.status(200).json({ accountId: account.id });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// }
