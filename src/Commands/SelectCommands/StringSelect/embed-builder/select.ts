import * as Discord from 'discord.js';
import { buildEmbed } from '../../../SlashCommands/embed-builder/create.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => buildEmbed(cmd, cmd.values[0]);
