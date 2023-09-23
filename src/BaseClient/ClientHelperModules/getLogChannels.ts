import type * as Discord from 'discord.js';
import DataBase from '../DataBase.js';

/**
 * Returns the log channel ID for the specified column name and guild.
 * @param columnName The name of the column to retrieve the log channel ID for.
 * @param guild The guild to retrieve the log channel ID for.
 * @returns The log channel ID for the specified column name and guild, or undefined if not found.
 */
export default async (
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
  | 'reactionevents'
  | 'memberevents',
 guild: Discord.Guild,
) => DataBase.logchannels.findUnique({ where: { guildid: guild.id } }).then((r) => r?.[columnName]);
