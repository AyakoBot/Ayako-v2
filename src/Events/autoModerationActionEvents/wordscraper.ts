import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 const presetLength = Number(msg.autoModerationRule?.triggerMetadata.presets.length);

 if (presetLength !== 1) return;
 if (!msg.autoModerationRule?.triggerMetadata.presets[0]) return;
 if (!msg.matchedKeyword) return;

 ch.DataBase.filterscraper
  .upsert({
   where: {
    keyword_filtertype: {
     keyword: msg.matchedKeyword,
     filtertype: msg.autoModerationRule?.triggerMetadata.presets[0],
    },
   },
   update: {},
   create: {
    keyword: msg.matchedKeyword,
    filtertype: msg.autoModerationRule?.triggerMetadata.presets[0],
   },
  })
  .then();
};
