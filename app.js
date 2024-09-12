import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { Client, GatewayIntentBits } from 'discord.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

// Setup Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ]
});

// Your Discord bot token
const TOKEN = process.env.DISCORD_TOKEN; // Use environment variable for safety!
const ROLE_ID = '1282801760733499495'; // The role ID you want to assign
const YOUR_USER_ID = '1064632636208849067'; // Your user ID

// Event handler for when the bot is ready
client.once('ready', () => {
  console.log('Bot is ready!');
});

// Event handler for when a member joins the server
client.on('guildMemberAdd', async (member) => {
  // Check if the new member is not the bot owner or an admin
  if (member.id !== YOUR_USER_ID && !member.roles.cache.some(role => role.permissions.has('ADMINISTRATOR'))) {
    const role = member.guild.roles.cache.get(ROLE_ID); // Get the role by ID

    if (role) {
      await member.roles.add(role); // Add the role to the member
      console.log(`Assigned role to ${member.user.tag}`);

      // Set a timeout to remove the role after 1 minute
      setTimeout(async () => {
        await member.roles.remove(role); // Remove the role
        console.log(`Removed role from ${member.user.tag}`);
      }, 60000); // 60000 ms = 1 minute
    } else {
      console.error('Role not found!');
    }
  } else {
    console.log(`Ignored member: ${member.user.tag}`);
  }
});

// Interactions endpoint URL where Discord will send HTTP requests
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, id, data } = req.body;

  // Interaction type handling ...
  // (Keep the existing interaction handling code here, as provided in your original app.js)

  // At the end of the interactions handling
  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

// Log the bot in
client.login(TOKEN)
  .then(() => {
    console.log('Logged in!');
  })
  .catch(console.error);