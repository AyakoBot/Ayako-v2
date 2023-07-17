import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';

// TODO: removes all reactions as of currently, even those in settings

export default async (cmd: Discord.ButtonInteraction, _: [], table?: 'reactionroles') => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings = await ch.query(
  `SELECT * FROM ${
   table ? 'reactionrolesettings' : 'buttonrolesettings'
  } WHERE guildid = $1 AND msgid = $2;`,
  [cmd.guildId, message.id],
  { returnType: table ? 'reactionrolesettings' : 'buttonrolesettings', asArray: false },
 );

 const settings = await ch.query(
  `SELECT * FROM ${table || 'buttonroles'} WHERE guildid = $1 AND linkedid = $2;`,
  [cmd.guildId, baseSettings?.uniquetimestamp],
  {
   returnType: table ? 'reactionroles' : 'buttonroles',
   asArray: true,
  },
 );

 let action: Discord.Message | Discord.DiscordAPIError | Discord.MessageReaction | undefined;

 if (table) {
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

 refresh(cmd);
};
