import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';

const name = 'logchannels';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
 const { embedParsers, buttonParsers } = ch.settingsHelpers;

 const settings = await ch
  .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
   cmd.guild?.id,
  ])
  .then(async (r: CT.TableNamesMap[typeof name][] | null) =>
   r ? r[0] : ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
  );
 const lan = language.slashCommands.settings.categories[name];

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
  description: `${language.slashCommands.rp.notice}\n${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
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
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.automodevents,
    'automodevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.channelevents,

    'channelevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.emojievents,
    'emojievents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.guildevents,
    'guildevents',
    name,
    undefined,
    'channel',
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
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.inviteevents,
    'inviteevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.messageevents,
    'messageevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings.roleevents, 'roleevents', name, undefined, 'channel'),
   buttonParsers.specific(
    language,
    settings.stageevents,
    'stageevents',
    name,
    undefined,
    'channel',
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
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.typingevents,
    'typingevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings.userevents, 'userevents', name, undefined, 'channel'),
   buttonParsers.specific(
    language,
    settings.voiceevents,
    'voiceevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.webhookevents,
    'webhookevents',
    name,
    undefined,
    'channel',
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.settingslog,
    'settingslog',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings.modlog, 'modlog', name, undefined, 'channel'),
   buttonParsers.specific(
    language,
    settings.reactionevents,
    'reactionevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.memberevents,
    'memberevents',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(
    language,
    settings.auditlogevents,
    'auditlogevents',
    name,
    undefined,
    'channel',
   ),
  ],
 },
];
