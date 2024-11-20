import { Client, GatewayIntentBits, PermissionsBitField, GuildChannelCreateOptions, ChannelType  } from "discord.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import superjson from "superjson";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
client.login(DISCORD_TOKEN);

// Rôles autorisés à voir le canal privé
const gradesAutorises = ["1298975634588176486", "1299090029276041298"]; // Owner, Admin
const rolePermissions = gradesAutorises.map((roleId) => ({
  id: roleId.toString(),
  allow: [PermissionsBitField.Flags.ViewChannel],
}));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { channelName, userId } = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const guildId = "1298971983437889588";
    const categoryId = "1308527605502185504";

    // Récupère l'ID Discord de l'utilisateur
    const account = await prisma.account.findUnique({
      where: { userId: Number(userId) }, 
      select: { providerAccountId: true },
    });

    if (!account || !account.providerAccountId) {
      return res.status(404).json({ error: "ID Discord non trouvé pour cet utilisateur" });
    }

    const providerAccountId = account.providerAccountId;
    if (!providerAccountId || !/^\d+$/.test(providerAccountId)) {
        return res.status(400).json({ error: "ID utilisateur Discord invalide" });
    }

    await client.guilds.fetch(guildId);
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return res.status(404).json({ error: "Serveur Discord non trouvé" });
    }

    const member = await guild.members.fetch(providerAccountId).catch(() => null);
    if (!member) {
      return res.status(404).json({ error: "Utilisateur non trouvé dans le serveur" });
    }

    // Vérification de la catégorie
    await guild.channels.fetch();
    const category = guild?.channels.cache.get(categoryId);

    if (!category || category.type !== 4) {
      return res.status(400).json({ error: "Catégorie non valide" });
    }

    // Crée le canal
    const newChannel = await guild.channels.create({
      name: channelName,
      type: 0,
      parent: categoryId,
      permissionOverwrites : [
        {
          id: guild.roles.everyone.id, 
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        ...rolePermissions,
        {
          id: providerAccountId,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
    await newChannel.send(`
      👋 **Bienvenue <@${providerAccountId}> dans votre espace pour devenir vendeur sur __Assets Store__ !** \n
Merci de votre intérêt à rejoindre notre communauté de vendeurs. Afin que nous puissions valider votre profil, merci de fournir les informations suivantes : \n
      - **1 - Votre domaine d'expertise :** *(Par exemple : modélisation 3D, graphisme, création de scripts, production audio, etc.)* \n
      - **2 - Exemples de vos créations :** Partagez un lien vers votre portfolio ou des exemples concrets de vos travaux passés. \n
      - **3 - Le ou les premiers produits que vous souhaitez vendre :** Donnez un aperçu de ce que vous prévoyez de mettre en ligne sur notre plateforme.\n
*Une fois que toutes les informations seront fournies, notre équipe examinera votre profil et vous répondra dans les plus brefs délais.*
      `)
    
    return res.status(200).json({
      message: "Canal créé avec succès",
      channelId: newChannel.id, 
    });
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de la création du canal:", error.message, error.stack);
      return res.status(500).json({
        error: "Erreur lors de la création du canal",
        details: error.message,
      });
    } else {
      console.error("Erreur inconnue :", error);
      return res.status(500).json({ error: "Erreur inconnue" });
    }
  }
}
