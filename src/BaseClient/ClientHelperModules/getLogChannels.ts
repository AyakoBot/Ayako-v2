import type * as Discord from 'discord.js';
import type DBT from '../../Typings/DataBaseTypings';
import client from '../Client.js';

export default async (
  columnName:
    | 'emojievents'
    | 'guildevents'
    | 'inviteevents'
    | 'messageevents'
    | 'modlogs'
    | 'roleevents'
    | 'userevents'
    | 'voiceevents'
    | 'webhookevents'
    | 'settingslog'
    | 'channelevents'
    | 'stickerevents'
    | 'guildmemberevents'
    | 'stageevents'
    | 'automodevents'
    | 'reactionevents'
    | 'scheduledevents',
  guild: Discord.Guild,
) =>
  client.ch
    .query(`SELECT ${columnName} FROM logchannels WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.logchannels[] | null) => (r ? r[0][columnName] : null));
