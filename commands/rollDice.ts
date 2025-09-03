import { BaseInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "./interface/commandMap";
import { GenerateRandomNumber } from "../utils/numberUtils";

const optionName = "faces";

export const rollDiceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("눈금들에 해당하는 다이스를 각각 굴려줍니다.")
    .addStringOption((option) =>
      option
        .setName(optionName)
        .setDescription("예: 100 100 100")
        .setRequired(true)
    ),
  execute: handleRollDice,
};

async function handleRollDice(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;

  const content = interaction.options.getString(optionName, true);

  const diceNumbers = content.replace("d ", "").split(" ");
  const embed = new EmbedBuilder({
    title: `${interaction.user.username}의 주사위 결과`,
  });
  let sum = 0;
  for (let i = 0; i < diceNumbers.length; i++) {
    const dice = parseInt(diceNumbers[i]);
    const result = GenerateRandomNumber(dice);
    sum += result;
    embed.addFields({
      name: `D${dice}`,
      value: `${result}`,
    });
  }

  embed.addFields({
    name: "합계",
    value: `${sum}`,
  });

  interaction.reply({ embeds: [embed] });
}
