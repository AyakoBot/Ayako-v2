import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import { findField } from '../../../SelectCommands/StringSelect/roles/button-roles.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const settings =
  (await ch.query(
   `SELECT * FROM buttonrolesettings WHERE guildid = $1 AND msgid = $2;`,
   [cmd.guildId, message.id],
   { returnType: 'buttonrolesettings', asArray: false },
  )) ??
  (await ch.query(
   `INSERT INTO buttonrolesettings (uniquetimestamp, active, onlyone, guildid, msgid, channelid) 
  VALUES ($1, true, false, $2, $3, $4);`,
   [Date.now(), cmd.guildId, message.id, message.channelId],
   { returnType: 'buttonrolesettings', asArray: false },
  ));

 if (!settings) {
  ch.error(cmd.guild, new Error('Failed to create settings'));
  return;
 }

 const buttonSettings = await ch.query(
  `SELECT * FROM buttonroles WHERE emote = $1 AND linkedid = $2;`,
  [args[0], settings.uniquetimestamp],
  {
   returnType: 'buttonroles',
   asArray: false,
  },
 );

 const field = findField(args[0], cmd.message.embeds[0].fields);
 const roles = field?.value.split(/,\s+/g).map((r) => r.replace(/\D+/g, '')) ?? [];

 if (buttonSettings) {
  await ch.query(
   `UPDATE buttonroles SET active = true, roles = $1 WHERE emote = $2 AND linkedid = $3;`,
   [roles, args[0], settings.uniquetimestamp],
  );
 } else {
  await ch.query(
   `INSERT INTO buttonroles (uniquetimestamp, guildid, active, emote, roles, linkedid)
   VALUES ($1, $2, true, $3, $4, $5);`,
   [Date.now(), cmd.guildId, args[0], roles, settings.uniquetimestamp],
  );
 }

 const action = await message.reactions.cache
  .get(args[0].split(/:/g)[1])
  ?.react()
  .catch((e) => e as Discord.DiscordAPIError);

 const lan = language.slashCommands.roles.builders;

 if (action && 'message' in action && typeof action.message === 'string') {
  ch.errorCmd(cmd, lan.couldntReact, language);
  return;
 }

 refresh(cmd);
};
