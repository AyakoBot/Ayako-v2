import type * as Discord from 'discord.js';
import DataBase from '../Bot/DataBase.js';

/**
 * Returns the log channel ID for the specified column name and guild.
 * @param columnName The name of the column to retrieve the log channel ID for.
 * @param guild The guild to retrieve the log channel ID for.
 * @returns The log channel ID for the specified column name and guild, or undefined if not found.
 */
export default (
 columnName:
  | 'applicationevents'
  | 'automodevents'
  | 'channelevents'
  | 'emojievents'
  | 'guildevents'
  | 'scheduledeventevents'
  | 'inviteevents'
  | 'messageevents'
  | 'roleevents'
  | 'stageevents'
  | 'stickerevents'
  | 'typingevents'
  | 'userevents'
  | 'voiceevents'
  | 'webhookevents'
  | 'settingslog'
  | 'modlog'
  | 'memberevents',
 guild: Discord.Guild,
): Promise<string[] | undefined> =>
 DataBase.logchannels
  .findUnique({ where: { guildid: guild.id }, select: { [columnName]: true } })
  .then((r) => ((r?.[columnName] as undefined | string[])?.length ? r?.[columnName] : undefined));
