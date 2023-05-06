import * as os from 'os';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.info.bot;

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    description: [
     {
      name: lan.shards,
      value: `${cmd.client.shard?.ids.length ?? 1}`,
     },
     {
      name: lan.uptime,
      value: `${ch.moment(process.uptime(), language)} - ${ch.constants.standard.getTime(
       Math.round(process.uptime()),
      )}`,
     },
    ],
   },
  ],
 });
};
