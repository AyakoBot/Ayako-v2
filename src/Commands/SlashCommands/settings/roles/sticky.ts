import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Sticky;

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
    name: lan.fields.stickypermsactive.name,
    value: embedParsers.boolean(settings?.stickypermsactive, language),
    inline: true,
   },
   {
    name: lan.fields.stickyrolesactive.name,
    value: embedParsers.boolean(settings?.stickyrolesactive, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.stickyrolesmode.name,
    value: settings?.stickyrolesmode
     ? `${client.util.constants.standard.getEmote(client.util.emotes.enabled)} ${lan.unsticky}`
     : `${client.util.constants.standard.getEmote(client.util.emotes.disabled)} ${lan.sticky}`,
    inline: false,
   },
   {
    name: lan.fields.roles.name,
    value: embedParsers.roles(settings?.roles, language),
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
   buttonParsers.boolean(
    language,
    settings?.stickypermsactive,
    'stickypermsactive',
    name,
    undefined,
   ),
   buttonParsers.boolean(
    language,
    settings?.stickyrolesactive,
    'stickyrolesactive',
    name,
    undefined,
   ),
   buttonParsers.specific(language, settings?.stickyrolesmode, 'stickyrolesmode', name, undefined),
   buttonParsers.specific(language, settings?.roles, 'roles', name, undefined, CT.EditorTypes.Role),
  ],
 },
];
