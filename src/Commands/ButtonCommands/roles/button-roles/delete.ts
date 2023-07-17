import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const settings = await ch.query(
  `SELECT * FROM buttonrolesettings WHERE guildid = $1 AND msgid = $2;`,
  [cmd.guildId, message.id],
  { returnType: 'buttonrolesettings', asArray: false },
 );

 if (settings) {
  await ch.query(
   `DELETE FROM buttonroles WHERE emote = $1 AND linkedid = $2;`,
   [args[0], settings.uniquetimestamp],
   {
    returnType: 'buttonroles',
    asArray: true,
   },
  );
 }

 const action = await message.reactions.cache
  .get(args[0].split(/:/g)[1])
  ?.remove()
  .catch((e) => e as Discord.DiscordAPIError);

 if (action && 'message' in action && typeof action.message === 'string') {
  ch.errorCmd(cmd, action.message, language);
  return;
 }

 refresh(cmd);
};
