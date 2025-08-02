import * as Discord from 'discord.js';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.RuleChannels;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories[name];

 const id = cmd.options.get('id', false)?.value as string;
 if (id) {
  showId(cmd, id, language, lan);
  return;
 }
 showAll(cmd, language, lan, 0);
};

export const showId: NonNullable<CT.SettingsFile<typeof name>['showId']> = async (
 cmd,
 id,
 language,
 lan,
) => {
 const { buttonParsers, embedParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { uniquetimestamp: parseInt(id, 36) },
  })
  .then(
   (r) =>
    r ??
    (client.util.settingsHelpers.setup(
     name,
     cmd.guildId,
     client.util.settingsHelpers.getUniquetimestampFromId(id),
    ) as unknown as CT.DataBaseTables[(typeof CT.SettingsName2TableName)[typeof name]]),
  );

 if (cmd.isButton()) {
  cmd.update({
   embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
   components: await getComponents(buttonParsers, settings, language, cmd.guild),
  });
  return;
 }

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language, cmd.guild),
  ephemeral: true,
 });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
 cmd,
 language,
 lan,
 page,
) => {
 const { multiRowHelpers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings?.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\` - ${
   new ChannelRules(s).toArray().length
  } ${language.t.ChannelRules} - ${Number(s.channels?.length)} ${language.t.Channels}`,
  value: `${language.t.Channels}: ${
   s.channels.length ? s.channels.map((c) => `<#${c}>`).slice(0, 5) : language.t.None
  }`,
 }));

 const embeds = multiRowHelpers.embeds(fields, language, lan, page);
 const components = multiRowHelpers.options(language, name);
 multiRowHelpers.noFields(embeds, language);
 multiRowHelpers.components(embeds, components, language, name, page);

 if (cmd.isButton()) {
  cmd.update({
   embeds,
   components,
  });
  return;
 }
 cmd.reply({
  embeds,
  components,
  ephemeral: true,
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => {
 const embeds: Discord.APIEmbed[] = [
  {
   footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },

   author: embedParsers.author(language, lan),
   description: `${
    client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
     ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
        name as keyof typeof client.util.constants.tutorials
       ].map((t) => `[${t.name}](${t.link})`)}`
     : ''
   }\n\n${
    settings
     ? new ChannelRules(settings)
        .toArray()
        .map((key) => {
         const rule = Object.entries(settings).find(([k, v]) =>
          k === key.toLowerCase() ? v : null,
         );
         if (!rule) return null;

         return `\`${language.channelRules[key](rule[1] as string)}\``;
        })
        .filter((r): r is string => !!r)
        .join('\n')
     : language.t.None
   }`,
   fields: [
    {
     name: lan.fields.channels.name,
     value: embedParsers.channels(settings?.channels, language),
     inline: false,
    },
   ],
  },
 ];

 return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.back(name, undefined),
   buttonParsers.specific(
    language,
    settings?.channels,
    'channels',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Channel,
   ),
   buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.hasleastattachments,
    'hasleastattachments',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasmostattachments,
    'hasmostattachments',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasleastcharacters,
    'hasleastcharacters',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasmostcharacters,
    'hasmostcharacters',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasleastwords,
    'hasleastwords',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.hasmostwords,
    'hasmostwords',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionsleastusers,
    'mentionsleastusers',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionsmostusers,
    'mentionsmostusers',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionsleastchannels,
    'mentionsleastchannels',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionsmostchannels,
    'mentionsmostchannels',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.mentionsleastroles,
    'mentionsleastroles',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionsmostroles,
    'mentionsmostroles',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasleastlinks,
    'hasleastlinks',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasmostlinks,
    'hasmostlinks',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasleastemotes,
    'hasleastemotes',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.hasmostemotes,
    'hasmostemotes',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasleastmentions,
    'hasleastmentions',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
   buttonParsers.specific(
    language,
    settings?.hasmostmentions,
    'hasmostmentions',
    name,
    Number(settings?.uniquetimestamp),
    undefined,
   ),
  ],
 },
];
