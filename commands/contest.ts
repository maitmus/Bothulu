import { BaseInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "./interface/commandMap";
import { GenerateRandomNumber } from "../utils/numberUtils";

const callerOptionName = "caller";
const againstOptionName = "against";

export const contestCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("contest")
    .setDescription("두 플레이어의 기능 대항 판정을 해 줍니다.")
    .addIntegerOption((option) =>
      option
        .setName(callerOptionName)
        .setDescription("호출하는 플레이어의 기능 수치")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName(againstOptionName)
        .setDescription("상대방의 기능 수치")
        .setRequired(true)
    ),
  execute: handleContest,
};

async function handleContest(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;

  const caller = interaction.options.getInteger(callerOptionName, true);
  const against = interaction.options.getInteger(againstOptionName, true);

  const amounts = [caller, against];

  const embed = new EmbedBuilder({
    title: `${interaction.user.username}의 대항 결과`,
  });
  const amounts_n: number[] = [];
  for (let i = 0; i < 2; i++) {
    amounts_n.push(amounts[i]);
  }
  const results: number[] = [];
  results.push(GenerateRandomNumber(100));
  results.push(GenerateRandomNumber(100));

  const success = [0, 0];

  for (let i = 0; i < 2; i++) {
    if (results[i] > amounts_n[i]) {
      //실패
      success[i] = 0;
      embed.addFields({
        name: `${i + 1}번 플레이어`,
        value: `결과: ${results[i]} -> 실패`,
      });
    } else if (results[i] > Math.floor(amounts_n[i] / 2)) {
      //보통 성공
      success[i] = 1;
      embed.addFields({
        name: `${i + 1}번 플레이어`,
        value: `결과: ${results[i]} -> 보통 성공`,
      });
    } else if (results[i] > Math.floor(amounts_n[i] / 5)) {
      //어려운 성공
      success[i] = 2;
      embed.addFields({
        name: `${i + 1}번 플레이어`,
        value: `결과: ${results[i]} -> 어려운 성공`,
      });
    } else {
      //극단적 성공
      success[i] = 3;
      embed.addFields({
        name: `${i + 1}번 플레이어`,
        value: `결과: ${results[i]} -> 극단적 성공`,
      });
    }
  }

  if (success[0] > success[1]) {
    embed.addFields({ name: "대항 결과", value: "1번 플레이어 승리" });
  } else if (success[0] < success[1]) {
    embed.addFields({ name: "대항 결과", value: "2번 플레이어 승리" });
  } else {
    if (amounts_n[0] > amounts_n[1]) {
      embed.addFields({
        name: "대항 결과",
        value: "성공 수준 동일 -> 기능 수치가 높은 1번 플레이어 승리",
      });
    } else if (amounts_n[0] < amounts_n[1]) {
      embed.addFields({
        name: "대항 결과",
        value: "성공 수준 동일 -> 기능 수치가 높은 2번 플레이어 승리",
      });
    } else {
      embed.addFields({
        name: "대항 결과",
        value: "성공 수준 동일 -> 기능 수치 동일 -> D100 굴린 후 판정",
      });

      const rand1 = GenerateRandomNumber(100);
      const rand2 = GenerateRandomNumber(100);

      if (rand1 < rand2) {
        embed.addFields({
          name: "D100",
          value: `플레이어 1: ${rand1}, 플레이어 2: ${rand2} -> 1번 플레이어 승리`,
        });
      } else if (rand1 > rand2) {
        embed.addFields({
          name: "D100",
          value: `플레이어 1: ${rand1}, 플레이어 2: ${rand2} -> 2번 플레이어 승리`,
        });
      } else {
        embed.addFields({
          name: "D100",
          value: `플레이어 1: ${rand1}, 플레이어 2: ${rand2} -> 무승부`,
        });
      }
    }
  }

  await interaction.reply({ embeds: [embed] });
}
