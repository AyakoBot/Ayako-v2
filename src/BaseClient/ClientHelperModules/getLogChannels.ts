import type * as Discord from 'discord.js';
import DataBase from '../DataBase.js';

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
  | 'memberevents'
  | 'auditlogevents',
 guild: Discord.Guild,
) => DataBase.logchannels.findUnique({ where: { guildid: guild.id } }).then((r) => r?.[columnName]);
