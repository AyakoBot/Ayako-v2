import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as DBT from '../../../Typings/DataBaseTypings.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const user = cmd.options.getUser('target', true);
 const rawID = cmd.options.getString('id', true);
 const id = Number.parseInt(rawID, 16);
 const punishment = await ch.getPunishment(id);
 const reason = cmd.options.getString('reason', false) ?? language.noReasonProvided;

 if (!punishment) {
  ch.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 await pardon(punishment);
 log(cmd, punishment, language, lan, reason);

 ch.replyCmd(cmd, { content: lan.pardoned(rawID, user.id) });
};

export const pardon = (
 punishment: NonNullable<CT.DePromisify<ReturnType<typeof ch.getPunishment>>>[number],
) =>
 ch.query(
  `DELETE FROM ${punishment.type} WHERE uniquetimestamp = $1 AND guildid = $2 AND userid = $3;`,
  [punishment.uniquetimestamp, punishment.guildid, punishment.userid],
 );

export const log = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 punishment: DBT.Punishment | DBT.TempPunishment,
 language: CT.Language,
 lan: CT.Language['slashCommands']['pardon'],
 reason: string,
) => {
 const logChannel = await ch.getLogChannels('modlog', cmd.guild);
 if (!logChannel) return;

 ch.send(
  { id: logChannel, guildId: cmd.guildId },
  {
   embeds: [
    {
     author: {
      name: lan.author,
     },
     color: ch.constants.colors.success,
     description: `${ch.util.makeBold(language.reason)}:\n\n${punishment.reason}`,
     fields: [
      {
       name: lan.target,
       value: language.languageFunction.getUser(
        (await ch.getUser(punishment.userid)) as CT.bEvalUser,
       ),
       inline: false,
      },
      {
       name: lan.executor,
       value: `${language.languageFunction.getUser(
        (await ch.getUser(punishment.executorid)) as CT.bEvalUser,
       )} - \`${punishment.executorname}\``,
       inline: false,
      },
      {
       name: lan.punishedIn,
       value: `${
        cmd.guild.channels.cache.get(punishment.channelid)
         ? language.languageFunction.getChannel(cmd.guild.channels.cache.get(punishment.channelid))
         : ch.util.makeInlineCode(punishment.channelid)
       } - \`${punishment.executorname}\``,
       inline: false,
      },
      {
       name: lan.punishedAt,
       value: `${ch.constants.standard.getTime(Number(punishment.uniquetimestamp))}\n${ch.moment(
        Number(punishment.uniquetimestamp),
        language,
       )}`,
       inline: false,
      },
      {
       name: lan.duration,
       value: `${
        'duration' in punishment && punishment.duration
         ? `${ch.moment(Number(punishment.duration), language)}`
         : '∞'
       }`,
       inline: false,
      },
      {
       name: lan.endedAt,
       value:
        'duration' in punishment && punishment.duration
         ? `${ch.constants.standard.getTime(
            Number(punishment.uniquetimestamp) + Number(punishment.duration),
           )}\n${ch.moment(Number(punishment.uniquetimestamp), language)}`
         : language.None,
       inline: false,
      },
     ],
     timestamp: new Date().toISOString(),
    },
    {
     color: ch.constants.colors.ephemeral,
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
       url: ch.constants.standard.msgurl(cmd.guildId, punishment.channelid, punishment.msgid),
      },
     ],
    },
   ],
  },
 );
};
