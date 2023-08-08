import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'blacklist';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
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
 guild,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
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
    name: lan.fields.blockinvites.name,
    value: embedParsers.boolean(settings?.blockinvites, language),
    inline: true,
   },
   {
    name: lan.fields.invitesaction.name,
    value: settings?.invitesaction
     ? language.punishments[settings?.invitesaction as keyof typeof language.punishments]
     : language.None,
    inline: true,
   },
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.invitesaction)
    ? [
       {
        name: lan.fields.invitesduration.name,
        value: embedParsers.time(Number(settings?.invitesduration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   {
    name: lan.fields.inviteswlchannelid.name,
    value: embedParsers.channels(settings?.inviteswlchannelid, language),
    inline: false,
   },
   {
    name: lan.fields.inviteswlroleid.name,
    value: embedParsers.roles(settings?.inviteswlroleid, language),
    inline: false,
   },
   {
    name: lan.fields.inviteswlroleid.name,
    value: embedParsers.roles(settings?.inviteswlroleid, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.maxnewlines.name,
    value: embedParsers.number(settings?.maxnewlines, language),
    inline: true,
   },
   {
    name: lan.fields.newlinesaction.name,
    value: settings?.newlinesaction
     ? language.punishments[settings?.newlinesaction as keyof typeof language.punishments]
     : language.None,
    inline: true,
   },
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.newlinesaction)
    ? [
       {
        name: lan.fields.newlinesduration.name,
        value: embedParsers.time(Number(settings?.newlinesduration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   {
    name: lan.fields.newlineswlchannelid.name,
    value: embedParsers.channels(settings?.newlineswlchannelid, language),
    inline: false,
   },
   {
    name: lan.fields.newlineswlroleid.name,
    value: embedParsers.roles(settings?.newlineswlroleid, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.repostenabled.name,
    value: embedParsers.boolean(settings?.repostenabled, language),
    inline: false,
   },
   {
    name: lan.fields.repostroles.name,
    value: embedParsers.roles(settings?.repostroles, language),
    inline: false,
   },
   {
    name: lan.fields.repostrules.name,
    value: embedParsers.rules(settings?.repostrules, language, guild),
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
  components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.blockinvites, 'blockinvites', name, undefined),
   buttonParsers.specific(language, settings?.invitesaction, 'invitesaction', name, undefined),
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.invitesaction)
    ? [
       buttonParsers.specific(
        language,
        settings?.invitesduration,
        'invitesduration',
        name,
        undefined,
       ),
      ]
    : []),
   buttonParsers.specific(
    language,
    settings?.inviteswlchannelid,
    'inviteswlchannelid',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings?.inviteswlroleid,
    'inviteswlroleid',
    name,
    undefined,
    'role',
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.maxnewlines, 'maxnewlines', name, undefined),
   buttonParsers.specific(language, settings?.newlinesaction, 'newlinesaction', name, undefined),
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.newlinesaction)
    ? [
       buttonParsers.specific(
        language,
        settings?.newlinesduration,
        'newlinesduration',
        name,
        undefined,
       ),
      ]
    : []),
   buttonParsers.specific(
    language,
    settings?.newlineswlchannelid,
    'newlineswlchannelid',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings?.newlineswlroleid,
    'newlineswlroleid',
    name,
    undefined,
    'role',
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.repostenabled, 'repostenabled', name, undefined),
   buttonParsers.specific(language, settings?.repostroles, 'repostroles', name, undefined, 'role'),
   buttonParsers.specific(language, settings?.repostrules, 'repostrules', name, undefined, 'role'),
  ],
 },
];
