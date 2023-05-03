import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'rule-channels';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
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
 const settings = await ch
  .query(
   `SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE uniquetimestamp = $1;`,
   [parseInt(ID, 36)],
  )
  .then(async (r: CT.TableNamesMap[typeof name][] | null) =>
   r ? r[0] : await ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
  );

 if (cmd.isButton()) {
  cmd.update({
   embeds: await getEmbeds(embedParsers, settings, language, lan),
   components: await getComponents(buttonParsers, settings, language),
  });
  return;
 }

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan),
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
 const settings = await ch
  .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
   cmd.guild?.id,
  ])
  .then((r: CT.TableNamesMap[typeof name][] | null) => r || null);

 const fields = settings?.map((s) => ({
  name: `${new ChannelRules(s).toArray().length} ${language.ChannelRules} - ${Number(
   s.channels?.length,
  )} ${language.Channels}`,
  value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
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
     : language.None
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
