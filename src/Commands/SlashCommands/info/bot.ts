import * as Discord from 'discord.js';
import * as os from 'os';
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
    color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
    description: `${[
     ...(stats
      ? [
         {
          name: `${pingLan.lastHeartbeat}:`,
          value: ch.util.makeInlineCode(`${stats.heartbeat} ${language.time.milliseconds}`),
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.guildcount)))} ${
           language.t.Servers
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.channelcount)))} ${
           language.t.Channels
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.rolecount)))} ${
           language.t.Roles
          }`,
          value: '',
         },
         {
          name: `${ch.util.makeInlineCode(ch.splitByThousand(Number(stats.allusers)))} ${
           language.t.Users
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
      value: `${ch.util.makeInlineCode(os.cpus()[0].model)}`,
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
