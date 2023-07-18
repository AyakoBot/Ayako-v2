import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import { putComponents } from './save.js';
import { typeWithoutDash } from '../../../SlashCommands/roles/builders/button-roles.js';
import * as DBT from '../../../../Typings/DataBaseTypings.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: 'button-roles' | 'reaction-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const settings = await ch.query(
  `SELECT * FROM ${typeWithoutDash(type)}ettings WHERE guildid = $1 AND msgid = $2;`,
  [cmd.guildId, message.id],
  {
   returnType: type === 'button-roles' ? 'buttonrolesettings' : 'reactionrolesettings',
   asArray: false,
  },
 );

 if (settings) {
  await ch.query(
   `DELETE FROM ${typeWithoutDash(type)} WHERE emote = $1 AND linkedid = $2;`,
   [emoji, settings.uniquetimestamp],
   {
    returnType: typeWithoutDash(type),
    asArray: true,
   },
  );

  const allSettings = await ch.query(
   `SELECT * FROM ${typeWithoutDash(type)} WHERE linkedid = $1;`,
   [settings.uniquetimestamp],
   { returnType: typeWithoutDash(type), asArray: true },
  );

  const action =
   type === 'button-roles'
    ? await putComponents(allSettings as DBT.buttonroles[], message)
    : await removeReactions(emoji, message);

  if (action && 'message' in action && typeof action.message === 'string') {
   ch.errorCmd(cmd, action.message, language);
   return;
  }
 }

 refresh(cmd, [], type);
};

const removeReactions = async (emoji: string, message: Discord.Message) =>
 message.reactions.cache
  .get((emoji.includes(':') ? emoji.split(/:/g)[1] : emoji) as string)
  ?.remove()
  .catch((e) => e as Discord.DiscordAPIError);
