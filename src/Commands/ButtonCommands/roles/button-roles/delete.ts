import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import {
 Type,
 getBaseSettings,
 getSpecificSettings,
} from '../../../SlashCommands/roles/builders/button-roles.js';
import refresh from './refresh.js';
import { putComponents } from './save.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const message = (await cmd.client.util.getMessage(
  cmd.message.embeds[0].url as string,
 )) as Discord.Message<true>;

 if (!message || message.guildId !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings = await getBaseSettings(type, cmd.guildId, message.id);

 if (baseSettings) {
  if (type === 'button-roles') {
   await cmd.client.util.DataBase.buttonroles.deleteMany({
    where: { emote: emoji, linkedid: baseSettings.uniquetimestamp.toString() },
   });
  } else {
   await cmd.client.util.DataBase.reactionroles.deleteMany({
    where: { emote: emoji, linkedid: baseSettings.uniquetimestamp.toString() },
   });
  }

  const settings = await getSpecificSettings(type, cmd.guildId, baseSettings.uniquetimestamp);

  const action =
   type === 'button-roles'
    ? await putComponents(settings as Prisma.buttonroles[], message)
    : await removeReactions(emoji, message);

  if (action && 'message' in action && typeof action.message === 'string') {
   cmd.client.util.errorCmd(cmd, action, language);
   return;
  }
 }

 refresh(cmd, [], type);
};

const removeReactions = (emoji: string, message: Discord.Message<true>) => {
 const emote = emoji ? Discord.parseEmoji(emoji) : undefined;
 const reaction = message.reactions.cache.get(emote?.id ?? emote?.name ?? '');

 if (!reaction) return undefined;
 return message.client.util.request.channels.deleteAllReactionsOfEmoji(
  message,
  reaction.emoji.identifier,
 );
};
