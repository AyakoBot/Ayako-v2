import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import { getCommands, getPayload } from '../../../SlashCommands/help/list.js';

export default async (cmd: Discord.StringSelectMenuInteraction) =>
 cmd.update(
  getPayload(
   await cmd.client.util.getLanguage(cmd.guildId),
   cmd.values[0] as CT.CommandCategories,
   await getCommands(cmd, cmd.values[0] as CT.CommandCategories),
  ) as Discord.InteractionUpdateOptions,
 );
