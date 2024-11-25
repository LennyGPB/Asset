import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import stripe from "@/lib/stripe";
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);
  
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      if (session.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
  
      const { id } = req.query;
  
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }
  
      try {
        // Mettre à jour le rôle de l'utilisateur en "seller"
        const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: { role: "seller" },
        });
  
        if (!updatedUser.email) {
          return res.status(400).json({ error: "User does not have a valid email address" });
        }
  
        // Créer un compte Stripe Standard pour l'utilisateur
        const account = await stripe.accounts.create({
          type: 'standard',
          country: 'FR',
          email: updatedUser.email,
        });
  
        // Enregistrer l'ID du compte Stripe dans la base de données
        await prisma.user.update({
          where: { id: Number(id) },
          data: { stripeId: account.id },
        });
  
        // Générer un lien d'onboarding pour configurer le compte Stripe
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          type: 'account_onboarding',
        });
  
        // Envoyer l'email au vendeur
        await sendOnboardingEmail(updatedUser.email, accountLink.url);
  
        // Répondre avec un message de confirmation
        return res.status(200).json({
          message: `Stripe Standard account created. An email has been sent to ${updatedUser.email} with instructions.`,
        });
      } catch (error) {
        console.error("Error updating user or creating Stripe account:", error);
        res.status(500).json({
          error: "Failed to update user or create Stripe account",
          details: error,
        });
      }
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
  // Fonction pour envoyer un email avec Brevo
  async function sendOnboardingEmail(email: string, accountLinkUrl: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Serveur SMTP Brevo
      port: 587, // Port recommandé pour Brevo
      secure: false, // Utilisez true pour le port 465
      auth: {
        user: process.env.EMAIL_USER, // Votre identifiant Brevo (adresse email)
        pass: process.env.EMAIL_PASS, // Votre clé API Brevo
      },
    });
  
    const mailOptions = {
      from: '"Assets Store" <capvertlenny@gmail.com>', // Adresse email vérifiée dans Brevo
      to: email, // Destinataire
      subject: 'Configurez votre compte Stripe',
      html: `
        <p>Bonjour,</p>
        <p>Vous avez été enregistré comme vendeur sur notre plateforme. Pour configurer votre compte Stripe et recevoir vos paiements, veuillez cliquer sur le lien ci-dessous :</p>
        <p><a href="${accountLinkUrl}">Configurer mon compte Stripe</a></p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>L'équipe Assets Store</p>
      `,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email d’onboarding envoyé avec succès à :', email, info);
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’email d’onboarding :', error);
      throw new Error('Failed to send onboarding email.');
    }
  }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === "PUT") {
//         const session = await getServerSession(req, res, authOptions);

//         if (!session) {
//             return res.status(401).json({ error: "Unauthorized" });
//         }

//         if (session.user.role !== "admin") {
//             return res.status(403).json({ error: "Forbidden" });
//         }
        
//         try {
//             const { id } = req.query;

//             // Mettre à jour le rôle de l'utilisateur en "seller"
//             const updatedUser = await prisma.user.update({
//                 where: { id: Number(id) },
//                 data: { role: "seller" },
//             });

//             // Créer un compte Stripe Express pour l'utilisateur
//             const account = await stripe.accounts.create({
//                 type: 'express',
//                 country: 'FR', // Adapter selon le pays
//                 email: updatedUser.email || undefined,
//                 capabilities: {
//                     transfers: { requested: true }, // Permettre à l'utilisateur de recevoir des fonds
//                 },
//             });

//             // Enregistrer l'ID du compte Stripe dans la base de données
//             await prisma.user.update({
//                 where: { id: Number(id) },
//                 data: { stripeId: account.id },
//             });

//             // Générer le lien d'onboarding pour configurer le compte Stripe
//             const accountLink = await stripe.accountLinks.create({
//                 account: account.id,
//                 refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`, // URL de retour en cas d'erreur
//                 return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`, // URL après la configuration réussie
//                 type: 'account_onboarding',
//             });

//             // Retourner l'URL d'onboarding pour que l'utilisateur puisse configurer son compte
//             return res.status(200).json({ accountLinkUrl: accountLink.url });
//         } catch (error) {
//             console.error("Error updating user or creating Stripe account:", error);
//             res.status(500).json({ error: "Failed to update user or create Stripe account" });
//         }
//     } else {
//         res.setHeader('Allow', ['PUT']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }