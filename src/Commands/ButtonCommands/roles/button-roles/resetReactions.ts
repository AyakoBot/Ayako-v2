import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import { typeWithoutDash } from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (
 cmd: Discord.ButtonInteraction,
 _: string[],
 type: 'reaction-roles' | 'button-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings = await ch.query(
  `SELECT * FROM ${typeWithoutDash(type)}ettings WHERE guildid = $1 AND msgid = $2;`,
  [cmd.guildId, message.id],
  {
   returnType: type === 'button-roles' ? 'buttonrolesettings' : 'reactionrolesettings',
   asArray: false,
  },
 );

 const settings = await ch.query(
  `SELECT * FROM ${typeWithoutDash(type)} WHERE guildid = $1 AND linkedid = $2;`,
  [cmd.guildId, baseSettings?.uniquetimestamp],
  {
   returnType: type === 'button-roles' ? 'buttonroles' : 'reactionroles',
   asArray: true,
  },
 );

 let action: Discord.Message | Discord.DiscordAPIError | Discord.MessageReaction | undefined;

 if (type === 'reaction-roles') {
  const reactionsToRemove = message.reactions.cache
   .filter((r) => !settings?.find((s) => s.emote === r.emoji.identifier))
   .map((r) => r);

  const firstEmoji = reactionsToRemove.shift();
  action = await firstEmoji?.remove().catch((e) => e as Discord.DiscordAPIError);
  if (action && 'message' in action && typeof action.message !== 'string') {
   reactionsToRemove.forEach((r) => r.remove());
  }
 } else {
  action = await message.reactions.removeAll().catch((e) => e as Discord.DiscordAPIError);
 }

 if (action && 'message' in action && typeof action.message === 'string') {
  ch.errorCmd(cmd, action.message, language);
  return;
 }

 refresh(cmd, [], type);
};
