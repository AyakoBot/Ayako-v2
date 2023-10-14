import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import { putComponents } from './save.js';
import {
 Type,
 getBaseSettings,
 getSpecificSettings,
} from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const language = await ch.getLanguage(cmd.guildId);
 const message = (await ch.getMessage(
  cmd.message.embeds[0].url as string,
 )) as Discord.Message<true>;

 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings = await getBaseSettings(type, cmd.guildId, message.id);

 if (baseSettings) {
  if (type === 'button-roles') {
   await ch.DataBase.buttonroles.deleteMany({
    where: { emote: emoji, linkedid: baseSettings.uniquetimestamp.toString() },
   });
  } else {
   await ch.DataBase.reactionroles.deleteMany({
    where: { emote: emoji, linkedid: baseSettings.uniquetimestamp.toString() },
   });
  }

  const settings = await getSpecificSettings(type, cmd.guildId, baseSettings.uniquetimestamp);

  const action =
   type === 'button-roles'
    ? await putComponents(settings as Prisma.buttonroles[], message)
    : await removeReactions(emoji, message);

  if (action && 'message' in action && typeof action.message === 'string') {
   ch.errorCmd(cmd, action, language);
   return;
  }
 }

 refresh(cmd, [], type);
};

const removeReactions = (emoji: string, message: Discord.Message<true>) => {
 const reaction = message.reactions.cache.get(
  (emoji.includes(':') ? emoji.split(/:/g)[1] : emoji) as string,
 );

 if (!reaction) return undefined;
 return ch.request.channels.deleteAllReactionsOfEmoji(message, reaction.emoji.identifier);
};
