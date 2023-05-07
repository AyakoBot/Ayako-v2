import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.d';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.info.role;
 const eventLan = language.events.logs.role;
 const role = cmd.options.getRole('role-mention', true);

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: role.color || ch.colorSelector(cmd.guild?.members.me),
  description: [
   {
    name: language.name,
    value: `${ch.util.makeInlineCode(role.name)}`,
   },
   {
    name: 'ID',
    value: `${ch.util.makeInlineCode(role.id)}`,
   },
   {
    name: language.Role,
    value: `${role}`,
   },
   role.color
    ? {
       name: `${language.color}`,
       value: `${ch.util.makeInlineCode(role.hexColor)}`,
      }
    : undefined,
   {
    name: language.createdAt,
    value: `${ch.constants.standard.getTime(role.createdTimestamp)}`,
   },
   {
    name: eventLan.hoisted,
    value: `${ch.settingsHelpers.embedParsers.boolean(role.hoist, language)}`,
   },
   {
    name: eventLan.mentionable,
    value: `${ch.settingsHelpers.embedParsers.boolean(role.mentionable, language)}`,
   },
   {
    name: lan.position,
    value: `${ch.util.makeInlineCode(String(role.position))}`,
   },
   role.unicodeEmoji
    ? {
       name: eventLan.unicodeEmoji,
       value: `${ch.util.makeInlineCode(role.unicodeEmoji as string)}`,
      }
    : undefined,
   role.tags?.botId
    ? {
       name: eventLan.managed,
       value: `${language.languageFunction.getUser(
        (await ch.getUser(role.tags.botId)) as CT.bEvalUser,
       )}`,
      }
    : undefined,
   role.tags?.integrationId
    ? {
       name: language.Bot,
       value: `${language.languageFunction.getUser(
        (await ch.getUser(role.tags.integrationId)) as CT.bEvalUser,
       )}`,
      }
    : undefined,
   role.tags?.premiumSubscriberRole
    ? {
       name: eventLan.boosterRole,
       value: `${ch.settingsHelpers.embedParsers.boolean(
        role.tags.premiumSubscriberRole,
        language,
       )}`,
      }
    : undefined,
   {
    name: eventLan.availableForPurchase,
    value: `${ch.settingsHelpers.embedParsers.boolean(role.tags?.availableForPurchase, language)}`,
   },
   {
    name: eventLan.guildConnections,
    value: `${ch.settingsHelpers.embedParsers.boolean(role.tags?.guildConnections, language)}`,
   },
   {
    name: lan.membercount,
    value: `${ch.util.makeInlineCode(ch.splitByThousand(role.members.size))}`,
   },
  ]
   .filter((v): v is { name: string; value: string } => !!v)
   .map((v) => `${ch.util.makeBold(`${v.name}:`)} ${v.value}`)
   .join('\n'),
 };

 if (role.iconURL()) {
  embed.thumbnail = {
   url: role.iconURL() as string,
  };
 }

 ch.replyCmd(cmd, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.Members,
      style: Discord.ButtonStyle.Secondary,
      customId: `info/members_${role.id}`,
     },
    ],
   },
  ],
 });
};
