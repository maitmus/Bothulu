import {
  BaseInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { helpCommand } from "../help";
import { initalizeStatCommand } from "../initializeStat";
import { rollDiceCommand } from "../rollDice";
import { contestCommand } from "../contest";
import { meleeCommand } from "../melee";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: BaseInteraction) => void;
}

export const commands = [
  helpCommand,
  initalizeStatCommand,
  rollDiceCommand,
  contestCommand,
  meleeCommand,
];
export const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));
