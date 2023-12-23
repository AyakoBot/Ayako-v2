import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Suggestions;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = ch.settingsHelpers;
 const settings = await ch.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    ch.DataBase[CT.SettingsName2TableName[name]].create({
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
  description: ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
   ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
      name as keyof typeof ch.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.channelid.name,
    value: embedParsers.channel(settings?.channelid, language),
    inline: true,
   },
   {
    name: lan.fields.approverroleid.name,
    value: embedParsers.roles(settings?.approverroleid, language),
    inline: false,
   },
   {
    name: lan.fields.anonvote.name,
    value: embedParsers.boolean(settings?.anonvote, language),
    inline: true,
   },
   {
    name: lan.fields.anonsuggestion.name,
    value: embedParsers.boolean(settings?.anonsuggestion, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.deletedenied.name,
    value: embedParsers.boolean(settings?.deletedenied, language),
    inline: true,
   },
   ...(settings?.deletedenied
    ? [
       {
        name: lan.fields.deletedeniedafter.name,
        value: embedParsers.time(Number(settings?.deletedeniedafter), language),
        inline: true,
       },
      ]
    : []),
   {
    name: lan.fields.deleteapproved.name,
    value: embedParsers.boolean(settings?.deleteapproved, language),
    inline: true,
   },
   ...(settings?.deleteapproved
    ? [
       {
        name: lan.fields.deleteapprovedafter.name,
        value: embedParsers.time(Number(settings?.deleteapproved), language),
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
    name: lan.fields.novoteroles.name,
    value: embedParsers.roles(settings?.novoteroles, language),
    inline: false,
   },
   {
    name: lan.fields.novoteusers.name,
    value: embedParsers.users(settings?.novoteusers, language),
    inline: false,
   },
   {
    name: lan.fields.nosendroles.name,
    value: embedParsers.roles(settings?.nosendroles, language),
    inline: false,
   },
   {
    name: lan.fields.nosendusers.name,
    value: embedParsers.users(settings?.nosendusers, language),
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
   buttonParsers.specific(
    language,
    settings?.channelid,
    'channelid',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings?.approverroleid,
    'approverroleid',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.boolean(language, settings?.anonvote, 'anonvote', name, undefined),
   buttonParsers.boolean(language, settings?.anonsuggestion, 'anonsuggestion', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.deletedenied, 'deletedenied', name, undefined),
   ...(settings?.deletedenied
    ? [
       buttonParsers.specific(
        language,
        settings?.deletedeniedafter,
        'deletedeniedafter',
        name,
        undefined,
       ),
      ]
    : []),
   buttonParsers.boolean(language, settings?.deleteapproved, 'deleteapproved', name, undefined),
   ...(settings?.deleteapproved
    ? [
       buttonParsers.specific(
        language,
        settings?.deleteapprovedafter,
        'deleteapprovedafter',
        name,
        undefined,
        CT.EditorTypes.Role,
       ),
      ]
    : []),
  ],
 },

 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.novoteroles,
    'novoteroles',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.novoteusers,
    'novoteusers',
    name,
    undefined,
    CT.EditorTypes.User,
   ),
   buttonParsers.specific(
    language,
    settings?.nosendroles,
    'nosendroles',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.nosendusers,
    'nosendusers',
    name,
    undefined,
    CT.EditorTypes.User,
   ),
  ],
 },
];
