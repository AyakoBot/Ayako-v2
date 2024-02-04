import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as S from '../../../../Typings/Settings.js';

const name = S.SettingNames.Nitro;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[S.SettingsName2TableName[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    client.util.DataBase[S.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const getEmbeds: S.SettingsFile<typeof name>['getEmbeds'] = async (
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
    name: lan.fields.logchannels.name,
    value: embedParsers.channels(settings?.logchannels, language),
    inline: true,
   },
   {
    name: lan.fields.rolemode.name,
    value: settings?.rolemode ? language.rolemodes.replace : language.rolemodes.stack,
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

export const getComponents: S.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, !!settings?.active, S.GlobalDescType.Active, name, undefined),
  ],
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
    S.EditorTypes.Channel,
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
    S.EditorTypes.Channel,
   ),
  ],
 },
];
