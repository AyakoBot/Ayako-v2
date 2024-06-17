import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';
import { tasksWithSettings } from '../../../BaseClient/Other/firstGuildInteraction.js';

const name = CT.SettingNames.Logs;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
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

 const lan = language.slashCommands.settings.categories[name];

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

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
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
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.automodevents,
    'automodevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.channelevents,
    'channelevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.emojievents,
    'emojievents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.guildevents,
    'guildevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
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
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.inviteevents,
    'inviteevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.messageevents,
    'messageevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.roleevents,
    'roleevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.stageevents,
    'stageevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
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
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.typingevents,
    'typingevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.userevents,
    'userevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.voiceevents,
    'voiceevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.webhookevents,
    'webhookevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.memberevents,
    'memberevents',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.settingslog,
    'settingslog',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.modlog,
    'modlog',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSetting,
 guild,
) => {
 if (!newSettings) return;

 switch (changedSetting) {
  case 'guildevents': {
   tasksWithSettings.welcomeScreen(guild, newSettings);
   tasksWithSettings.integrations(guild, newSettings);
   return;
  }
  case 'scheduledeventevents': {
   tasksWithSettings.scheduledEvents(guild, newSettings);
   return;
  }
  case 'webhookevents': {
   tasksWithSettings.webhooks(guild, newSettings);
   return;
  }
  case 'memberevents':
  case 'inviteevents': {
   tasksWithSettings.invites(guild, newSettings);
   return;
  }

  default:
   break;
 }
};
