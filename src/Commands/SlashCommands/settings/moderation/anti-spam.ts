import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.AntiSpam;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]
   ?.length
   ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
      name as keyof typeof client.util.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.action.name,
    value: settings?.action
     ? language.punishments[settings?.action as keyof typeof language.punishments]
     : language.t.None,
    inline: true,
   },
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.action)
    ? [
       {
        name: lan.fields.duration.name,
        value: embedParsers.time(Number(settings?.duration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   ...(['ban', 'softban', 'tempban'].includes(settings?.action)
    ? [
       {
        name: lan.fields.deletemessageseconds.name,
        value: embedParsers.time(Number(settings?.deletemessageseconds) * 1000, language),
        inline: true,
       },
      ]
    : []),
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },

   {
    name: lan.fields.msgthreshold.name,
    value: embedParsers.number(settings?.msgthreshold, language),
    inline: true,
   },
   {
    name: lan.fields.dupemsgthreshold.name,
    value: embedParsers.number(settings?.dupemsgthreshold, language),
    inline: true,
   },
   {
    name: lan.fields.timeout.name,
    value: embedParsers.number(settings?.timeout, language),
    inline: true,
   },
   {
    name: lan.fields.deletespam.name,
    value: embedParsers.boolean(settings?.deletespam, language),
    inline: true,
   },
   {
    name: language.slashCommands.settings.BLWL.wlchannelid,
    value: embedParsers.channels(settings?.wlchannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wlroleid,
    value: embedParsers.roles(settings?.wlroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wluserid,
    value: embedParsers.users(settings?.wluserid, language),
    inline: false,
   },
  ],
 },
];

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, !!settings?.active, CT.GlobalDescType.Active, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.action, 'action', name, undefined),
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.action)
    ? [buttonParsers.specific(language, settings?.duration, 'duration', name, undefined)]
    : []),
   ...(['tempban', 'softban', 'ban'].includes(settings?.action)
    ? [
       buttonParsers.specific(
        language,
        settings?.deletemessageseconds,
        'deletemessageseconds',
        name,
        undefined,
       ),
      ]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.msgthreshold, 'msgthreshold', name, undefined),
   buttonParsers.specific(
    language,
    settings?.dupemsgthreshold,
    'dupemsgthreshold',
    name,
    undefined,
   ),
   buttonParsers.specific(language, settings?.timeout, 'timeout', name, undefined),
   buttonParsers.boolean(language, settings?.deletespam, 'deletespam', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(
    language,
    settings?.wlchannelid,
    CT.GlobalDescType.WLChannelId,
    name,
    undefined,
   ),
   buttonParsers.global(language, settings?.wlroleid, CT.GlobalDescType.WLRoleId, name, undefined),
   buttonParsers.global(language, settings?.wluserid, CT.GlobalDescType.WLUserId, name, undefined),
  ],
 },
];
