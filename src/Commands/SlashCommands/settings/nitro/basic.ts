import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'nitro';

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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
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
    name: lan.fields.logchannels.name,
    value: embedParsers.channels(settings?.logchannels, language),
    inline: true,
   },
   {
    name: lan.fields.rolemode.name,
    value: settings?.rolemode ? language.t.rolemodes.replace : language.t.rolemodes.stack,
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.notification.name,
    value: embedParsers.boolean(settings?.notification, language),
    inline: true,
   },
   {
    name: lan.fields.notifembed.name,
    value: await embedParsers.embed(settings?.notifembed, language),
    inline: true,
   },
   {
    name: lan.fields.notifchannels.name,
    value: embedParsers.channels(settings?.notifchannels, language),
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
   buttonParsers.specific(
    language,
    settings?.logchannels,
    'logchannels',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings?.rolemode, 'rolemode', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.notification, 'notification', name, undefined),
   buttonParsers.specific(language, settings?.notifembed, 'notifembed', name, undefined),
   buttonParsers.specific(
    language,
    settings?.notifchannels,
    'notifchannels',
    name,
    undefined,
    'channel',
   ),
  ],
 },
];
