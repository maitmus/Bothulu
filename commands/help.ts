import { BaseInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "./interface/commandMap";

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("도움말을 볼 수 있습니다."),
  execute: handleHelp,
};

async function handleHelp(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;
  const embed = new EmbedBuilder({ title: "명령어" })
    .addFields({
      name: "/roll 눈금 눈금 눈금...",
      value: "눈금들에 해당하는 다이스를 각각 굴려줍니다.",
    })
    .addFields({
      name: "/init",
      value: "캐릭터 제작 시 특성치를 자동으로 결정해줍니다.",
    })
    .addFields({
      name: "/contest 기능수치 기능수치",
      value: "두 플레이어의 기능 대항 판정을 해 줍니다.",
    })
    .addFields({
      name: "/melee 근접전수치 회피/반격수치 피해(nDm) 피해보너스(nDm) 반격대미지(nDm/수치) (Close-Range)",
      value: "근접전에 대한 판정을 해줍니다.",
    });

  await interaction.reply({ embeds: [embed] });
}
