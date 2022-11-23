import Jobs from 'node-schedule';
import type * as DDeno from 'discordeno';
import type DBT from '../Typings/DataBaseTypings';
import type CT from '../Typings/CustomTypings';
import client from '../BaseClient/DDenoClient.js';

export default async (
  source: string,
  m?: CT.MessageGuild | null,
  settings?: DBT.antivirus,
  embed?: DDeno.Embed,
) => {
  let minimizeTimeout = 0;
  let deleteTimeout = 0;

  switch (source) {
    case 'antivirus': {
      minimizeTimeout = Number(settings?.minimize);
      deleteTimeout = Number(settings?.delete);

      if (deleteTimeout <= minimizeTimeout) {
        Jobs.scheduleJob(new Date(Date.now() + deleteTimeout), () => {
          if (m) client.helpers.deleteMessage(m.channelId, m.id).catch(() => null);
        });
      } else {
        if (embed && embed.fields?.[0].value) {
          embed.description = embed.fields?.[0].value;
          embed.fields = [];

          Jobs.scheduleJob(new Date(Date.now() + minimizeTimeout), () => {
            if (m) {
              client.helpers.editMessage(m.channelId, m.id, { embeds: [embed] }).catch(() => null);
            }
          });
        }

        Jobs.scheduleJob(new Date(Date.now() + deleteTimeout), () => {
          if (m) client.helpers.deleteMessage(m.channelId, m.id).catch(() => null);
        });
      }

      break;
    }
    default: {
      break;
    }
  }
};
