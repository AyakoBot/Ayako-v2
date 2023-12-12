import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'anti-raid';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = ch.settingsHelpers;
 const settings = await ch.DataBase[TableNamesPrismaTranslation[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    ch.DataBase[TableNamesPrismaTranslation[name]].create({
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
        value: embedParsers.channels(settings?.pingusers, language),
        inline: false,
       },
       {
        name: lan.fields.pingroles.name,
        value: embedParsers.channels(settings?.pingroles, language),
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
  components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
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
        'channel',
       ),
       buttonParsers.specific(language, settings?.pingusers, 'pingusers', name, undefined, 'user'),
       buttonParsers.specific(language, settings?.pingroles, 'pingroles', name, undefined, 'role'),
      ]
    : []),
  ],
 },
];
