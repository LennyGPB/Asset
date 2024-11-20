const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config({ path: './.env' }); 

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

if (!process.env.DISCORD_TOKEN || typeof process.env.DISCORD_TOKEN !== 'string') {
  throw new Error("Token Discord non valide ou manquant");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Erreur lors de la connexion du bot :", error);
});
