import { BaseInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "./interface/commandMap";
import { GenerateRandomNumber } from "../utils/numberUtils";

// 상수 선언
const attackOptionName = "attack";
const defenseOptionName = "defense";
const damageOptionName = "damage";
const bonusOptionName = "bonus";
const counterOptionName = "counter";

async function handleMelee(interaction: BaseInteraction) {
  if (!interaction.isChatInputCommand() || !interaction.channel?.isSendable())
    return;

  const embed = new EmbedBuilder({
    title: `${interaction.user.username}의 전투 결과`,
  });

  // 옵션 가져오기
  const attackPercent = interaction.options.getInteger(attackOptionName, true);
  const defensePercent = interaction.options.getInteger(
    defenseOptionName,
    true
  );
  const damageInput = interaction.options
    .getString(damageOptionName, true)
    .toLowerCase();
  const bonusInput = interaction.options
    .getString(bonusOptionName, true)
    .toLowerCase();
  const counterInput = interaction.options
    .getString(counterOptionName, true)
    .toLowerCase();

  const attackRoll = GenerateRandomNumber(100);
  const defenseRoll = GenerateRandomNumber(100);

  // 성공 수준 계산
  const getSuccessLevel = (roll: number, skill: number): number => {
    if (roll > skill) return 0; // 실패
    if (roll <= Math.floor(skill / 5)) return 3; // 극단적 성공
    if (roll <= Math.floor(skill / 2)) return 2; // 어려운 성공
    return 1; // 보통 성공
  };

  const attackerLevel = getSuccessLevel(attackRoll, attackPercent);
  const defenderLevel = getSuccessLevel(defenseRoll, defensePercent);

  let attackerWins: boolean;

  if (attackerLevel > defenderLevel) {
    attackerWins = true;
  } else if (attackerLevel < defenderLevel) {
    attackerWins = false;
  } else {
    // 동률일 경우 능력치 비교
    attackerWins = attackPercent >= defensePercent;
  }

  if (!attackerWins) {
    // 반격 성공 처리
    const [count, sides] = counterInput.split("d").map((v) => parseInt(v));
    if (isNaN(count) || isNaN(sides)) {
      await interaction.reply("반격 대미지를 잘못 입력하셨습니다.");
      return;
    }

    let total = 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll = GenerateRandomNumber(sides);
      rolls.push(roll);
      total += roll;
    }

    const counterMessage =
      `근접전 D100: ${attackRoll}, 방어 D100: ${defenseRoll}` +
      `\n반격 대미지(${count}D${sides}): ${rolls.join(
        " "
      )}\n총 반격 대미지: ${total}`;

    embed.addFields({
      name: "방어자 승리 - 회피/반격 성공",
      value: counterMessage,
    });
    await interaction.reply({ embeds: [embed] });
  } else {
    // 공격 성공 → 피해 및 보너스 계산
    const parseDice = (input: string): number[] => {
      if (input.includes("d")) {
        const [c, s] = input.split("d").map((v) => parseInt(v));
        return isNaN(c) || isNaN(s)
          ? []
          : Array.from({ length: c }, () =>
              attackerLevel === 3 ? s : GenerateRandomNumber(s)
            );
      } else {
        const value = parseInt(input);
        return isNaN(value) ? [] : [value];
      }
    };

    const damageRolls = parseDice(damageInput);
    const bonusRolls = parseDice(bonusInput);

    if (damageRolls.length === 0 || bonusRolls.length === 0) {
      await interaction.reply("대미지나 보너스 값을 잘못 입력하셨습니다.");
      return;
    }

    const totalDamage = [...damageRolls, ...bonusRolls].reduce(
      (a, b) => a + b,
      0
    );

    const message =
      `근접전 D100: ${attackRoll}, 방어 D100: ${defenseRoll}\n` +
      `공격 성공 수준: ${attackerLevel}, 방어 성공 수준: ${defenderLevel}` +
      `\n대미지: ${damageRolls.join(" ")}${
        attackerLevel === 3 ? " (극단적 성공 → 최대 피해)" : ""
      }` +
      `\n보너스: ${bonusRolls.join(" ")}${
        attackerLevel === 3 ? " (극단적 성공 → 최대 피해)" : ""
      }` +
      `\n총 대미지: ${Math.max(0, totalDamage)}`;

    embed.addFields({
      name: "공격자 승리 - 피해 계산",
      value: message,
    });
  }

  await interaction.reply({ embeds: [embed] });
}

// 커맨드 등록
export const meleeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("melee")
    .setDescription("근접전을 판정합니다.")
    .addIntegerOption((option) =>
      option
        .setName(attackOptionName)
        .setDescription("근접전 수치")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName(defenseOptionName)
        .setDescription("회피/반격 수치")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(damageOptionName)
        .setDescription("피해 주사위 (예: 1d6)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(bonusOptionName)
        .setDescription("피해 보너스 (예: 1d4 또는 숫자)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(counterOptionName)
        .setDescription("반격 피해 (예: 1d4 또는 숫자)")
        .setRequired(true)
    ),
  execute: handleMelee,
};
