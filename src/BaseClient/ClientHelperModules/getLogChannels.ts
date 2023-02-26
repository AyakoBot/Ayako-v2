import type * as Discord from 'discord.js';
import type DBT from '../../Typings/DataBaseTypings';
import query from './query.js';

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
) =>
  query(`SELECT ${columnName} FROM logchannels WHERE guildid = $1 LIMIT 1;`, [guild.id]).then(
    (r: DBT.logchannels[] | null) => (r ? r[0][columnName] : null),
  );
