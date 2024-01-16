import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.AntiRaid;
// TODO: finish this
// const requiredPerms = [Discord.PermissionFlagsBits.ManageGuild];

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 // if (!cmd.client.util.settingsHelpers.permissionCheck(cmd, language, requiredPerms)) {
 //  return;
 // }

 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({ where: { guildid: cmd.guildId } })
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
    name: lan.fields.disableinvites.name,
    value: embedParsers.boolean(settings?.disableinvites, language),
    inline: true,
   },
   {
    name: lan.fields.actiontof.name,
    value: embedParsers.boolean(settings?.actiontof, language),
    inline: true,
   },
   ...(settings?.actiontof
    ? [
       {
        name: lan.fields.action.name,
        value: settings?.action
         ? language.punishments[settings?.action as keyof typeof language.punishments]
         : language.t.None,
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
    name: lan.fields.jointhreshold.name,
    value: embedParsers.number(settings?.jointhreshold, language),
    inline: true,
   },
   {
    name: lan.fields.timeout.name,
    value: embedParsers.number(settings?.timeout, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.posttof.name,
    value: embedParsers.boolean(settings?.posttof, language),
    inline: true,
   },
   ...(settings?.posttof
    ? [
       {
        name: lan.fields.postchannels.name,
        value: embedParsers.channels(settings?.postchannels, language),
        inline: false,
       },
       {
        name: lan.fields.pingusers.name,
        value: embedParsers.users(settings?.pingusers, language),
        inline: false,
       },
       {
        name: lan.fields.pingroles.name,
        value: embedParsers.roles(settings?.pingroles, language),
        inline: false,
       },
      ]
    : []),
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
   buttonParsers.boolean(language, settings?.disableinvites, 'disableinvites', name, undefined),
   buttonParsers.boolean(language, settings?.actiontof, 'actiontof', name, undefined),
   ...(settings?.actiontof
    ? [buttonParsers.specific(language, settings?.action, 'action', name, undefined)]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.jointhreshold, 'jointhreshold', name, undefined),
   buttonParsers.specific(language, settings?.timeout, 'timeout', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.posttof, 'posttof', name, undefined),
   ...(settings?.posttof
    ? [
       buttonParsers.specific(
        language,
        settings?.postchannels,
        'postchannels',
        name,
        undefined,
        CT.EditorTypes.Channel,
       ),
       buttonParsers.specific(
        language,
        settings?.pingusers,
        'pingusers',
        name,
        undefined,
        CT.EditorTypes.User,
       ),
       buttonParsers.specific(
        language,
        settings?.pingroles,
        'pingroles',
        name,
        undefined,
        CT.EditorTypes.Role,
       ),
      ]
    : []),
  ],
 },
];
