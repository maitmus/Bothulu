import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import "dotenv/config";

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
          name: "!d 눈금 눈금 눈금... (Dice)",
          value: "눈금들에 해당하는 다이스를 각각 굴려줍니다.",
        })
        .addFields({
          name: "!i (Init)",
          value: "캐릭터 제작 시 특성치를 자동으로 결정해줍니다.",
        })
        .addFields({
          name: "!a 기능수치 기능수치 (Against)",
          value: "두 플레이어의 기능 대항 판정을 해 줍니다.",
        })
        .addFields({
          name: "!cr 근접전수치 회피/반격수치 피해(nDm) 피해보너스(nDm) 반격데미지(nDm/수치) (Close-Range)",
          value: "근접전에 대한 판정을 해줍니다.",
        });
      message.channel.send({ embeds: [embed] });
      break;
  }

  if (content == "i") {
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
      title: `${message.author.username}의 캐릭터 생성 결과`,
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

    message.channel.send({ embeds: [embed] });
  }

  if (content.startsWith("d ")) {
    const diceNumbers = content.replace("d ", "").split(" ");
    const embed = new EmbedBuilder({
      title: `${message.author.username}의 주사위 결과`,
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
    message.channel.send({ embeds: [embed] });
  }

  if (content.startsWith("a ")) {
    const amounts = content.replace("a ", "").split(" ");
    if (amounts.length != 2) {
      message.channel.send("잘못 입력하셨습니다. 사용법: !a 기능수치 기능수치");
    } else {
      const embed = new EmbedBuilder({
        title: `${message.author.username}의 대항 결과`,
      });
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

  if (content.startsWith("cr ")) {
    const datas = content.replace("cr ", "").split(" ");
    if (datas.length != 5) {
      message.channel.send(
        "잘못 입력하셨습니다. 사용법: !cr 근접전수치 회피/반격수치 피해(nDm) 피해보너스(nDm/수치) 반격데미지(nDm)"
      );
    } else {
      const embed = new EmbedBuilder({
        title: `${message.author.username}의 전투 결과`,
      });
      const cr_percent = parseInt(datas[0]);
      const cr = GenerateRandomNumber(100);

      if (cr > cr_percent) {
        embed.addFields({ name: "근접전 실패", value: `근접전 D100: ${cr}` });
        message.channel.send({ embeds: [embed] });
      } else {
        const avoid_percent = parseInt(datas[1]);
        const avoid = GenerateRandomNumber(100);
        const results: number[] = [];
        if (cr > Math.floor(cr_percent / 2)) results.push(1);
        else if (cr > Math.floor(cr_percent / 5)) results.push(2);
        else results.push(3);
        if (avoid > avoid_percent) results.push(0);
        else if (avoid > Math.floor(avoid_percent / 2)) results.push(1);
        else if (avoid > Math.floor(avoid_percent / 5)) results.push(2);
        else results.push(3);

        if (results[0] < results[1]) {
          const counter_attack = datas[4].toLowerCase().split("d");
          let counter_damage = 0;
          let counter_msg = `\n반격 데미지(${datas[4].replace("d", "D")}): `;
          if (counter_attack.length != 2) {
            message.channel.send("데미지를 잘못 입력하셨습니다.");
            return;
          }
          for (let i = 0; i < parseInt(counter_attack[0]); i++) {
            const current_damage = GenerateRandomNumber(
              parseInt(counter_attack[1])
            );
            counter_damage += current_damage;
            counter_msg += `${current_damage} `;
          }
          embed.addFields({
            name: "회피/반격 성공",
            value: `근접전 D100: ${cr}, 회피/반격 D100: ${avoid}` + counter_msg,
          });
          message.channel.send({ embeds: [embed] });
        } else {
          const damage = datas[2].toLowerCase().split("d");
          const damage_bonus = datas[3].toLowerCase().split("d");
          if (
            (damage_bonus.includes("d") && damage_bonus.length != 2) ||
            damage.length != 2
          ) {
            message.channel.send("데미지를 잘못 입력하셨습니다.");
            return;
          }
          let damage_sum = 0;
          let damage_msg = `데미지(${parseInt(damage[0])}D${parseInt(
            damage[1]
          )}): `;
          for (let i = 0; i < parseInt(damage[0]); i++) {
            let current_damage: number;
            if (results[0] == 3) {
              current_damage = parseInt(damage[1]);
            } else {
              current_damage = GenerateRandomNumber(parseInt(damage[1]));
            }
            damage_sum += current_damage;
            damage_msg += `${current_damage} `;
          }
          if (results[0] == 3) damage_msg += "(극단적 성공 -> 최대 데미지)";
          if (damage_bonus.includes("d")) {
            damage_msg += `\n데미지 보너스(${parseInt(
              damage_bonus[0]
            )}D${parseInt(damage_bonus[1])}): `;
            for (let i = 0; i < parseInt(damage_bonus[0]); i++) {
              let current_damage: number;
              if (results[0] == 3) {
                current_damage = parseInt(damage_bonus[1]);
              } else {
                current_damage = GenerateRandomNumber(
                  parseInt(damage_bonus[1])
                );
              }
              damage_sum += current_damage;
              damage_msg += `${current_damage} `;
            }
            if (results[0] == 3) damage_msg += "(극단적 성공 -> 최대 데미지)";
          } else {
            damage_msg += `\n데미지 보너스: ${parseInt(datas[3])}`;
            damage_sum += parseInt(datas[3]);
          }
          if (damage_sum < 0) damage_sum = 0;
          damage_msg += `\n총 데미지: ${damage_sum}`;
          embed.addFields({
            name: "공격 성공 - 데미지 계산",
            value: damage_msg,
          });
          message.channel.send({ embeds: [embed] });
        }
      }
    }
  }
});

client.once("clientReady", () => {
  client.user?.setPresence({ activities: [{ name: "!명령어" }] });
  console.log(`Bot Ready: ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
