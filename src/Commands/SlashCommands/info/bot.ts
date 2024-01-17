import * as Discord from 'discord.js';
import * as os from 'os';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.bot;
 const pingLan = language.slashCommands.ping;
 const stats = await cmd.client.util.DataBase.stats.findFirst();

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
    description: `${[
     ...(stats
      ? [
         {
          name: `${pingLan.lastHeartbeat}:`,
          value: cmd.client.util.util.makeInlineCode(
           `${stats.heartbeat} ${language.time.milliseconds}`,
          ),
         },
         {
          name: `${cmd.client.util.util.makeInlineCode(
           cmd.client.util.splitByThousand(Number(stats.guildcount)),
          )} ${language.t.Servers}`,
          value: '',
         },
         {
          name: `${cmd.client.util.util.makeInlineCode(
           cmd.client.util.splitByThousand(Number(stats.channelcount)),
          )} ${language.t.Channels}`,
          value: '',
         },
         {
          name: `${cmd.client.util.util.makeInlineCode(
           cmd.client.util.splitByThousand(Number(stats.rolecount)),
          )} ${language.t.Roles}`,
          value: '',
         },
         {
          name: `${cmd.client.util.util.makeInlineCode(
           cmd.client.util.splitByThousand(Number(stats.allusers)),
          )} ${language.t.Users}`,
          value: '',
         },
        ]
      : []),

     {
      name: `${cmd.client.util.util.makeInlineCode(
       String(cmd.client.util.files.sharding.getInfo().CLUSTER_COUNT ?? 1),
      )} ${lan.clusters}\n${cmd.client.util.util.makeInlineCode(
       String(cmd.client.util.files.sharding.getInfo().SHARD_LIST.length ?? 1),
      )} ${lan.shards}`,
      value: '',
     },
     {
      name: `${lan.uptime}:`,
      value: `${cmd.client.util.util.makeInlineCode(
       cmd.client.util.moment(Math.round(process.uptime() * 1000), language),
      )}`,
     },
     {
      name: `${lan.CPU}:`,
      value: `${cmd.client.util.util.makeInlineCode(os.cpus()[0].model)}`,
     },
     {
      name: `${lan.OS}:`,
      value: `${cmd.client.util.util.makeInlineCode(`${os.type()} ${os.arch()}`)}`,
     },
     {
      name: `${lan.OSruntime}:`,
      value: `${cmd.client.util.constants.standard.getTime(Date.now() - os.uptime() * 1000)}`,
     },
     {
      name: `${lan.memory}:`,
      value: `${cmd.client.util.util.makeInlineCode(
       `${lan.free}: ${cmd.client.util.splitByThousand(Math.round(os.freemem() / 1000000000))}GB`,
      )} / ${cmd.client.util.util.makeInlineCode(
       `${lan.total}: ${cmd.client.util.splitByThousand(Math.round(os.totalmem() / 1000000000))}GB`,
      )}`,
     },
    ]
     .map(({ name, value }) => `${cmd.client.util.util.makeBold(name)} ${value}`)
     .join('\n')}\n\n${lan.base}`,
   },
  ],
 });
};
