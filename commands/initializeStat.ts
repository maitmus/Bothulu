import { BaseInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "./interface/commandMap";
import { GenerateRandomNumber } from "../utils/numberUtils";

export const initalizeStatCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("init")
    .setDescription("캐릭터 제작 시 특성치를 자동으로 결정해줍니다."),
  execute: handleInitalizeStat,
};

async function handleInitalizeStat(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;
  const strength: number[] = [];
  const health: number[] = [];
  const quickness: number[] = [];
  const appearance: number[] = [];
  const mental: number[] = [];
  const luck: number[] = [];
  for (let i = 0; i < 3; i++) {
    strength.push(GenerateRandomNumber(6));
    health.push(GenerateRandomNumber(6));
    quickness.push(GenerateRandomNumber(6));
    appearance.push(GenerateRandomNumber(6));
    mental.push(GenerateRandomNumber(6));
    luck.push(GenerateRandomNumber(6));
  }
  const size: number[] = [];
  const intelligence: number[] = [];
  const education: number[] = [];
  for (let i = 0; i < 2; i++) {
    size.push(GenerateRandomNumber(6));
    intelligence.push(GenerateRandomNumber(6));
    education.push(GenerateRandomNumber(6));
  }

  strength.push(5 * (strength[0] + strength[1] + strength[2]));
  health.push(5 * (health[0] + health[1] + health[2]));
  quickness.push(5 * (quickness[0] + quickness[1] + quickness[2]));
  appearance.push(5 * (appearance[0] + appearance[1] + appearance[2]));
  mental.push(5 * (mental[0] + mental[1] + mental[2]));
  luck.push(5 * (luck[0] + luck[1] + luck[2]));

  size.push(5 * (size[0] + size[1] + 6));
  intelligence.push(5 * (intelligence[0] + intelligence[1] + 6));
  education.push(5 * (education[0] + education[1] + 6));

  const embed = new EmbedBuilder({
    title: `${interaction.user.username}의 캐릭터 생성 결과`,
  })
    .addFields({
      name: "근력",
      value: `(${strength[0]} + ${strength[1]} + ${strength[2]}) * 5 = ${strength[3]}`,
    })
    .addFields({
      name: "건강",
      value: `(${health[0]} + ${health[1]} + ${health[2]}) * 5 = ${health[3]}`,
    })
    .addFields({
      name: "크기",
      value: `(${size[0]} + ${size[1]} + 6) * 5 = ${size[2]}`,
    })
    .addFields({
      name: "민첩성",
      value: `(${quickness[0]} + ${quickness[1]} + ${quickness[2]}) * 5 = ${quickness[3]}`,
    })
    .addFields({
      name: "외모",
      value: `(${appearance[0]} + ${appearance[1]} + ${appearance[2]}) * 5 = ${appearance[3]}`,
    })
    .addFields({
      name: "지능",
      value: `(${intelligence[0]} + ${intelligence[1]} + 6) * 5 = ${intelligence[2]}`,
    })
    .addFields({
      name: "정신력",
      value: `(${mental[0]} + ${mental[1]} + ${mental[2]}) * 5 = ${mental[3]}`,
    })
    .addFields({
      name: "교육",
      value: `(${education[0]} + ${education[1]} + 6) * 5 = ${education[2]}`,
    })
    .addFields({
      name: "운",
      value: `(${luck[0]} + ${luck[1]} + ${luck[2]}) * 5 = ${luck[3]}`,
    });

  await interaction.reply({ embeds: [embed] });
}
