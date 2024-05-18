import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import type { Returned } from '../../../../BaseClient/UtilModules/getPunishment.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const user = cmd.options.getUser('target', true);
 const rawID = cmd.options.getString('id', true);
 const id = Number.parseInt(rawID, 36);
 const punishment = await client.util.getPunishment(id);
 const reason = cmd.options.getString('reason', false) ?? language.t.noReasonProvided;

 if (!punishment) {
  client.util.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 await pardon(punishment);
 log(cmd, punishment, language, lan, reason);

 client.util.replyCmd(cmd, { content: lan.pardoned(rawID, user.id) });
};

export const pardon = (
 punishment: NonNullable<CT.DePromisify<ReturnType<typeof client.util.getPunishment>>>[number],
) => {
 const where = { where: { uniquetimestamp: punishment.uniquetimestamp } };

 switch (punishment.type) {
  case CT.PunishmentType.Ban:
   return client.util.DataBase.punish_bans.deleteMany(where);
  case CT.PunishmentType.Channelban:
   return client.util.DataBase.punish_channelbans.deleteMany(where);
  case CT.PunishmentType.Kick:
   return client.util.DataBase.punish_kicks.deleteMany(where);
  case CT.PunishmentType.Mute:
   return client.util.DataBase.punish_mutes.deleteMany(where);
  case CT.PunishmentType.Warn:
   return client.util.DataBase.punish_warns.deleteMany(where);
  default:
   return undefined;
 }
};

export const log = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 punishment: Returned,
 language: CT.Language,
 lan: CT.Language['slashCommands']['pardon'],
 reason: string,
) => {
 const logChannel = await client.util.getLogChannels('modlog', cmd.guild);
 if (!logChannel) return;

 client.util.send(
  { id: logChannel, guildId: cmd.guildId },
  {
   embeds: [
    {
     author: {
      name: lan.author,
     },
     color: CT.Colors.Success,
     description: `${client.util.util.makeBold(language.t.Reason)}:\n${punishment.reason}`,
     fields: [
      {
       name: lan.target,
       value: language.languageFunction.getUser(
        (await client.util.getUser(punishment.userid)) as Discord.User,
       ),
       inline: false,
      },
      {
       name: lan.executor,
       value: `${language.languageFunction.getUser(
        (await client.util.getUser(punishment.executorid)) as Discord.User,
       )} - ${lan.channel}: \`${punishment.channelname}\``,
       inline: false,
      },
      {
       name: lan.punishedIn,
       value: `${
        cmd.guild.channels.cache.get(punishment.channelid)
         ? language.languageFunction.getChannel(cmd.guild.channels.cache.get(punishment.channelid))
         : client.util.util.makeInlineCode(punishment.channelid)
       } - ${lan.username}: \`${punishment.executorname}\``,
       inline: false,
      },
      {
       name: lan.punishedAt,
       value: `${client.util.constants.standard.getTime(
        Number(punishment.uniquetimestamp),
       )}\n${client.util.moment(
        Math.abs(Number(punishment.uniquetimestamp) - Date.now()),
        language,
       )}`,
       inline: false,
      },
      {
       name: lan.duration,
       value: `${
        'duration' in punishment && punishment.duration
         ? `${client.util.moment(Number(punishment.duration), language)}`
         : '∞'
       }`,
       inline: false,
      },
      {
       name: lan.endedAt,
       value:
        'duration' in punishment && punishment.duration
         ? `${client.util.constants.standard.getTime(
            Number(punishment.uniquetimestamp) + Number(punishment.duration),
           )}\n${client.util.moment(
            Math.abs(Number(punishment.uniquetimestamp) - Date.now()),
            language,
           )}`
         : '-',
       inline: false,
      },
     ],
     timestamp: new Date().toISOString(),
    },
    {
     color: CT.Colors.Ephemeral,
     author: { name: lan.pardonReason },
     description: reason,
    },
   ],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Link,
       url: client.util.constants.standard.msgurl(
        cmd.guildId,
        punishment.channelid,
        punishment.msgid,
       ),
       label: language.t.Message,
      },
     ],
    },
   ],
  },
 );
};
