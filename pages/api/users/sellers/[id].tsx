import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import stripe from "@/lib/stripe";


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

            // Créer un compte Stripe Express pour l'utilisateur
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'FR', // Adapter selon le pays
                email: updatedUser.email || undefined,
                capabilities: {
                    transfers: { requested: true }, // Permettre à l'utilisateur de recevoir des fonds
                },
            });

            // Enregistrer l'ID du compte Stripe dans la base de données
            await prisma.user.update({
                where: { id: Number(id) },
                data: { stripeId: account.id },
            });

            // Générer le lien d'onboarding pour configurer le compte Stripe
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://localhost:3000/admin/users', // URL de retour en cas d'erreur
                return_url: 'https://localhost:3000/admin/users', // URL après la configuration réussie
                type: 'account_onboarding',
            });

            // Retourner l'URL d'onboarding pour que l'utilisateur puisse configurer son compte
            return res.status(200).json({ accountLinkUrl: accountLink.url });
        } catch (error) {
            console.error("Error updating user or creating Stripe account:", error);
            res.status(500).json({ error: "Failed to update user or create Stripe account" });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}