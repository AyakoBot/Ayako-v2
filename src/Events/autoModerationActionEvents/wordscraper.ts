import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 const presetLength = Number(msg.autoModerationRule?.triggerMetadata.presets.length);

 if (presetLength !== 1) return;

 ch.query(
  `INSERT INTO filterscraper (keyword, filtertype) VALUES ($1, $2) ON CONFLICT(keyword) DO NOTHING;`,
  [msg.matchedKeyword, msg.autoModerationRule?.triggerMetadata.presets[0]],
 );
};
