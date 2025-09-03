import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import * as path from "path";
import { commandMap, commands } from "./commands/interface/commandMap";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "dev";
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
dotenv.config({ path: envPath });

console.log(`현재 환경: ${NODE_ENV}`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
const TEST_GUILD_ID = process.env.TEST_GUILD_ID;

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;

  const command = commandMap.get(interaction.commandName);

  command?.execute(interaction);
});

client.once("clientReady", async () => {
  client.user?.setPresence({ activities: [{ name: "!명령어" }] });

  const commandJSON = commands.map((cmd) => cmd.data.toJSON());
  const applicationId = process.env.APPLICATION_ID!;

  if (TEST_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(applicationId, TEST_GUILD_ID),
      { body: commandJSON }
    );
  }
  console.log(`Bot Ready: ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
