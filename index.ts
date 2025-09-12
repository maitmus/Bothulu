import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import * as path from "path";
import { commandMap, commands } from "./commands/interface/commandMap";
import logger from "./logger/logger";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? "prod";
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
dotenv.config({ path: envPath });

logger.info(`현재 환경: ${process.env.NODE_ENV}`);

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
  client.user?.setPresence({ activities: [{ name: "/help" }] });

  const commandJSON = commands.map((cmd) => cmd.data.toJSON());
  const applicationId = process.env.APPLICATION_ID!;

  //테스트 가동 시 테스트 서버에만 커맨드 전파
  if (TEST_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(applicationId, TEST_GUILD_ID),
      { body: commandJSON }
    );
    logger.debug(`${TEST_GUILD_ID} 서버에 커맨드 적용 완료`);
  }

  //프로덕션 가동 시 전체 서버 커맨드 전파
  if (NODE_ENV == "prod") {
    await rest.put(Routes.applicationCommands(applicationId), {
      body: commandJSON,
    });
  }

  logger.info(`봇 준비 완료: ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
