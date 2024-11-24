import { Client, GatewayIntentBits, PermissionsBitField, GuildChannelCreateOptions, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder  } from "discord.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import superjson from "superjson";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
client.login(DISCORD_TOKEN);

// Rôles autorisés à voir le canal privé
const gradesAutorises = ["1298975634588176486", "1299090029276041298", "1310212858599964682"]; // Owner, Admin
const rolePermissions = gradesAutorises.map((roleId) => ({
  id: roleId.toString(),
  allow: [PermissionsBitField.Flags.ViewChannel],
}));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { channelName, userId, category, description } = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const guildId = "1298971983437889588";
    const categoryId = "1308529203355848826";

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

    // embed
    const embedService = new EmbedBuilder()
    .setTitle(`Service : ${category}`)
    .setDescription(`## Description : \n\n ${description}`)
    .setColor("#FFFFFF")

    const claimButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setLabel("Prendre la commande")
    .setCustomId(`claimButton_${providerAccountId}`)

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton);

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
    await newChannel.send({ embeds: [embedService], components: [actionRow] });
    
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
