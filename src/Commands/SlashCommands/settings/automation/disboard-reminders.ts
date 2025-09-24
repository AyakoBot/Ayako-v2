import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.DisboardReminders;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
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
  components: await getComponents(buttonParsers, settings, language, cmd.guild),
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
    name: lan.fields.deletereply.name,
    value: embedParsers.boolean(settings?.deletereply, language),
    inline: true,
   },
   {
    name: lan.fields.channelid.name,
    value: embedParsers.channel(settings?.channelid, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.repeatenabled.name,
    value: embedParsers.boolean(settings?.repeatenabled, language),
    inline: true,
   },
   {
    name: lan.fields.repeatreminder.name,
    value: embedParsers.time(Number(settings?.repeatreminder) * 1000, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.roles.name,
    value: embedParsers.roles(settings?.roles, language),
    inline: false,
   },
   {
    name: lan.fields.users.name,
    value: embedParsers.users(settings?.users, language),
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
   buttonParsers.boolean(language, settings?.deletereply, 'deletereply', name, undefined),
   buttonParsers.specific(
    language,
    settings?.channelid,
    'channelid',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.boolean(language, settings?.repeatenabled, 'repeatenabled', name, undefined),
   buttonParsers.specific(language, settings?.repeatreminder, 'repeatreminder', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.roles, 'roles', name, undefined, CT.EditorTypes.Role),
   buttonParsers.specific(language, settings?.users, 'users', name, undefined, CT.EditorTypes.User),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 _changedSetting,
 guild,
) => {
 if (!newSettings) return;

 if (Number(newSettings.repeatreminder) < 300) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: guild.id },
    data: { repeatreminder: 300 },
   })
   .then();
 }
};
