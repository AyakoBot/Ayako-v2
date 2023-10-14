import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import {
 Type,
 getBaseSettings,
 getSpecificSettings,
} from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (cmd: Discord.ButtonInteraction, _: string[], type: Type = 'button-roles') => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const message = (await ch.getMessage(
  cmd.message.embeds[0].url as string,
 )) as Discord.Message<true>;

 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings = await getBaseSettings(type, cmd.guildId, message.id);
 if (!baseSettings) {
  ch.error(cmd.guild, new Error('Failed to find settings'));
  return;
 }

 const settings = await getSpecificSettings(type, cmd.guildId, baseSettings?.uniquetimestamp);

 let action: Discord.Message | Discord.DiscordAPIError | void | undefined;

 if (type === 'reaction-roles') {
  const reactionsToRemove = message.reactions.cache
   .filter((r) => !settings?.find((s) => s.emote === r.emoji.identifier))
   .map((r) => r);

  const firstEmoji = reactionsToRemove.shift();
  action = firstEmoji
   ? await ch.request.channels.deleteAllReactionsOfEmoji(message, firstEmoji?.emoji.identifier)
   : undefined;
  if (action && 'message' in action && typeof action.message !== 'string') {
   reactionsToRemove.forEach((r) =>
    ch.request.channels.deleteAllReactionsOfEmoji(message, r.emoji.identifier),
   );
  }
 } else action = await ch.request.channels.deleteAllReactions(message);

 if (action && 'message' in action && typeof action.message === 'string') {
  ch.errorCmd(cmd, action, language);
  return;
 }

 refresh(cmd, [], type);
};
