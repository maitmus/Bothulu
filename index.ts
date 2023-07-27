import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import token from "./auth";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

const prefix = "!";

function GenerateRandomNumber(dice: number) {
  return Math.floor(Math.random() * dice) + 1;
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const content = message.content.replace(prefix, "").toLowerCase();

  switch (content) {
    case "명령어":
    case "help":
      const embed = new EmbedBuilder({ title: "명령어" })
        .addFields({
          name: "!d 눈금 눈금 눈금...",
          value: "눈금들에 해당하는 다이스를 각각 굴려줍니다.",
        })
        .addFields({
          name: "a 기능수치 기능수치",
          value: "두 플레이어의 기능 대항 판정을 해 줍니다.",
        });
      message.channel.send({ embeds: [embed] });
      break;
  }

  if (content.startsWith("d")) {
    const diceNumbers = content.replace("d ", "").split(" ");
    const embed = new EmbedBuilder({ title: "결과" });
    for (let i = 0; i < diceNumbers.length; i++) {
      const dice = parseInt(diceNumbers[i]);
      const result = GenerateRandomNumber(dice);
      embed.addFields({
        name: `D${dice}`,
        value: `${result}`,
      });
    }
    message.channel.send({ embeds: [embed] });
  }

  if (content.startsWith("a")) {
    const amounts = content.replace("a ", "").split(" ");
    if (amounts.length != 2) {
      message.channel.send("잘못 입력하셨습니다. 사용법: a 기능수치 기능수치");
    } else {
      const embed = new EmbedBuilder({ title: "대항 결과" });
      const amounts_n: number[] = [];
      for (let i = 0; i < 2; i++) {
        amounts_n.push(parseInt(amounts[i]));
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

      message.channel.send({ embeds: [embed] });
    }
  }
});

client.once("ready", () => {
  client.user?.setPresence({ activities: [{ name: "!명령어" }] });
  console.log(`Bot Ready: ${client.user?.tag}`);
});

client.login(token);
