import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as S from '../../../../Typings/Settings.js';

const name = S.SettingNames.Welcome;

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
    name: lan.fields.channelid.name,
    value: embedParsers.channel(settings?.channelid, language),
    inline: true,
   },
   {
    name: lan.fields.embed.name,
    value: await embedParsers.embed(settings?.embed, language),
    inline: true,
   },
   {
    name: lan.fields.pingjoin.name,
    value: embedParsers.boolean(settings?.pingjoin, language),
    inline: true,
   },
   {
    name: lan.fields.pingroles.name,
    value: embedParsers.roles(settings?.pingroles, language),
    inline: false,
   },
   {
    name: lan.fields.pingusers.name,
    value: embedParsers.users(settings?.pingusers, language),
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
    settings?.channelid,
    'channelid',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(language, settings?.embed, 'embed', name, undefined),
   buttonParsers.boolean(language, settings?.pingjoin, 'pingjoin', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.pingroles,
    'pingroles',
    name,
    undefined,
    S.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.pingusers,
    'pingusers',
    name,
    undefined,
    S.EditorTypes.User,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Success,
    custom_id: 'events/guildMemberAdd_welcome',
    label: language.events.guildMemberAdd.welcome.test,
   },
  ],
 },
];
