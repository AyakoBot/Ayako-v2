import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import * as S from '../../../Typings/Settings.js';

const name = S.SettingNames.Logs;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
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

 const lan = language.slashCommands.settings.categories[name];

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const getEmbeds: S.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: Object.entries(lan.fields).map(([key, value]) => ({
   name: value.name,
   value: embedParsers.channels(settings[key as keyof typeof settings] as string[], language),
   inline: false,
  })),
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
   buttonParsers.specific(
    language,
    settings.applicationevents,
    'applicationevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.automodevents,
    'automodevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.channelevents,
    'channelevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.emojievents,
    'emojievents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.guildevents,
    'guildevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.scheduledeventevents,
    'scheduledeventevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.inviteevents,
    'inviteevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.messageevents,
    'messageevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.roleevents,
    'roleevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.stageevents,
    'stageevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.stickerevents,
    'stickerevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.typingevents,
    'typingevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.userevents,
    'userevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.voiceevents,
    'voiceevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.webhookevents,
    'webhookevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.reactionevents,
    'reactionevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.memberevents,
    'memberevents',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.settingslog,
    'settingslog',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.modlog,
    'modlog',
    name,
    undefined,
    S.EditorTypes.Channel,
   ),
  ],
 },
];
