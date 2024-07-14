import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) {
  cmd.client.util.guildOnly(cmd);
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.role;
 const eventLan = language.events.logs.role;
 const role = cmd.options.getRole('role', true);

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color:
   role.color || cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
  description: [
   {
    name: language.t.name,
    value: `${cmd.client.util.util.makeInlineCode(role.name)}`,
   },
   {
    name: 'ID',
    value: `${cmd.client.util.util.makeInlineCode(role.id)}`,
   },
   {
    name: language.t.Role,
    value: `${role}`,
   },
   role.color
    ? {
       name: `${language.t.color}`,
       value: `${cmd.client.util.util.makeInlineCode(role.hexColor)}`,
      }
    : undefined,
   {
    name: language.t.createdAt,
    value: `${cmd.client.util.constants.standard.getTime(role.createdTimestamp)}`,
   },
   {
    name: eventLan.hoisted,
    value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(role.hoist, language)}`,
   },
   {
    name: eventLan.mentionable,
    value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(role.mentionable, language)}`,
   },
   {
    name: lan.position,
    value: `${cmd.client.util.util.makeInlineCode(String(role.position))}`,
   },
   role.unicodeEmoji
    ? {
       name: eventLan.unicodeEmoji,
       value: `${cmd.client.util.util.makeInlineCode(role.unicodeEmoji as string)}`,
      }
    : undefined,
   role.tags?.botId
    ? {
       name: eventLan.managed,
       value: `${language.languageFunction.getUser(
        (await cmd.client.util.getUser(role.tags.botId)) as Discord.User,
       )}`,
      }
    : undefined,
   role.tags?.integrationId
    ? {
       name: language.t.Bot,
       value: `${language.languageFunction.getUser(
        (await cmd.client.util.getUser(role.tags.integrationId)) as Discord.User,
       )}`,
      }
    : undefined,
   role.tags?.premiumSubscriberRole
    ? {
       name: eventLan.boosterRole,
       value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(
        role.tags.premiumSubscriberRole,
        language,
       )}`,
      }
    : undefined,
   {
    name: eventLan.availableForPurchase,
    value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(
     role.tags?.availableForPurchase,
     language,
    )}`,
   },
   {
    name: eventLan.inOnboarding,
    value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(
     role.flags.has(Discord.RoleFlags.InPrompt),
     language,
    )}`,
   },
   {
    name: eventLan.guildConnections,
    value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(
     role.tags?.guildConnections,
     language,
    )}`,
   },
   {
    name: lan.membercount,
    value: `${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(role.members.size),
    )}`,
   },
  ]
   .filter((v): v is { name: string; value: string } => !!v)
   .map((v) => `${cmd.client.util.util.makeBold(`${v.name}:`)} ${v.value}`)
   .join('\n'),
 };

 if (role.iconURL()) {
  embed.thumbnail = {
   url: role.iconURL() as string,
  };
 }

 cmd.client.util.replyCmd(cmd, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.t.Members,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/members_${role.id}`,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.ChannelSelect,
      custom_id: `info/perms_${role.id}_role`,
      placeholder: lan.viewChannelPermissions,
      max_values: 1,
      min_values: 1,
     },
    ],
   },
  ],
 });
};
