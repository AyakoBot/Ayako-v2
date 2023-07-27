import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'suggestions';

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
  embeds: await getEmbeds(embedParsers, settings, language, lan),
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
  components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.channelid, 'channelid', name, undefined, 'channel'),
   buttonParsers.specific(
    language,
    settings?.approverroleid,
    'approverroleid',
    name,
    undefined,
    'role',
   ),
   buttonParsers.boolean(language, settings?.anonvote, 'anonvote', name, undefined),
   buttonParsers.boolean(language, settings?.anonsuggestion, 'anonsuggestion', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.novoteroles, 'novoteroles', name, undefined, 'role'),
   buttonParsers.specific(language, settings?.novoteusers, 'novoteusers', name, undefined, 'user'),
   buttonParsers.specific(language, settings?.nosendroles, 'nosendroles', name, undefined, 'role'),
   buttonParsers.specific(language, settings?.nosendusers, 'nosendusers', name, undefined, 'user'),
  ],
 },
];
