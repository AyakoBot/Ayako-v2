import * as os from 'os';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.bot;
 const pingLan = language.slashCommands.ping;
 const stats = await ch.DataBase.stats.findFirst();

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
    description: `${[
     ...(stats
      ? [
         {
          name: `${pingLan.lastHeartbeat}:`,
          value: ch.util.makeInlineCode(`${stats.heartbeat} ${language.time.milliseconds}`),
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.guildcount)))} ${
           language.Servers
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.channelcount)))} ${
           language.Channels
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.rolecount)))} ${
           language.Roles
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.allusers)))} ${
           language.Users
          }`,
          value: '',
         },
        ]
      : []),

     {
      name: `${ch.util.makeInlineCode(String(cmd.client.shard?.ids.length ?? 1))} ${lan.shards}`,
      value: '',
     },
     {
      name: `${lan.uptime}:`,
      value: `${ch.util.makeInlineCode(ch.moment(Math.round(process.uptime() * 1000), language))}`,
     },
     {
      name: `${lan.CPU}:`,
      value: `${ch.util.makeInlineCode(os.cpus()[0].model)} / \`${
       Math.round(os.cpus()[0].speed / 100) / 10
      }GHz\``,
     },
     {
      name: `${lan.OS}:`,
      value: `${ch.util.makeInlineCode(`${os.type()} ${os.arch()}`)}`,
     },
     {
      name: `${lan.OSruntime}:`,
      value: `${ch.constants.standard.getTime(Date.now() - os.uptime() * 1000)}`,
     },
     {
      name: `${lan.memory}:`,
      value: `${ch.util.makeInlineCode(
       `${lan.free}: ${ch.splitByThousand(Math.round(os.freemem() / 1000000000))}GB`,
      )} / ${ch.util.makeInlineCode(
       `${lan.total}: ${ch.splitByThousand(Math.round(os.totalmem() / 1000000000))}GB`,
      )}`,
     },
    ]
     .map(({ name, value }) => `${ch.util.makeBold(name)} ${value}`)
     .join('\n')}\n\n${lan.base}`,
   },
  ],
 });
};
