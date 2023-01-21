import Jobs from 'node-schedule';
import type * as Discord from 'discord.js';
import type DBT from '../Typings/DataBaseTypings';

export default async (
  source: string,
  m?: Discord.Message,
  settings?: DBT.antivirus,
  embed?: Discord.APIEmbed,
) => {
  let minimizeTimeout = 0;
  let deleteTimeout = 0;

  switch (source) {
    case 'antivirus': {
      minimizeTimeout = Number(settings?.minimize);
      deleteTimeout = Number(settings?.delete);

      if (deleteTimeout <= minimizeTimeout) {
        Jobs.scheduleJob(new Date(Date.now() + deleteTimeout), () => {
          if (m) m.delete().catch(() => null);
        });
      } else {
        if (embed && embed.fields?.[0].value) {
          embed.description = embed.fields?.[0].value;
          embed.fields = [];

          Jobs.scheduleJob(new Date(Date.now() + minimizeTimeout), () => {
            if (m) m.edit({ embeds: [embed] }).catch(() => null);
          });
        }

        Jobs.scheduleJob(new Date(Date.now() + deleteTimeout), () => {
          if (m) m.delete().catch(() => null);
        });
      }

      break;
    }
    default: {
      break;
    }
  }
};
