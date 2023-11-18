import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'rule-channels';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];

 const ID = cmd.options.get('id', false)?.value as string;
 if (ID) {
  showID(cmd, ID, language, lan);
  return;
 }
 showAll(cmd, language, lan);
};

export const showID: NonNullable<CT.SettingsFile<typeof name>['showID']> = async (
 cmd,
 ID,
 language,
 lan,
) => {
 const { buttonParsers, embedParsers } = ch.settingsHelpers;
 const settings = await ch.DataBase[TableNamesPrismaTranslation[name]]
  .findUnique({
   where: { uniquetimestamp: parseInt(ID, 36) },
  })
  .then(
   (r) =>
    r ??
    (ch.settingsHelpers.setup(
     name,
     cmd.guildId,
     ID ? parseInt(ID, 36) : Date.now(),
    ) as unknown as CT.TableNamesMap[typeof name]),
  );

 if (cmd.isButton()) {
  cmd.update({
   embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
   components: await getComponents(buttonParsers, settings, language),
  });
  return;
 }

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
 cmd,
 language,
 lan,
) => {
 const { multiRowHelpers } = ch.settingsHelpers;
 const settings = await ch.DataBase[TableNamesPrismaTranslation[name]].findMany({
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

 const embeds = multiRowHelpers.embeds(fields, language, lan);
 const components = multiRowHelpers.options(language, name);
 multiRowHelpers.noFields(embeds, language);
 multiRowHelpers.components(embeds, components, language, name);

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
    ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
     ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
        name as keyof typeof ch.constants.tutorials
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
    'channel',
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
