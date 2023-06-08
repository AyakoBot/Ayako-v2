import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'blacklist';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = ch.settingsHelpers;
 const settings = await ch
  .query(
   `SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`,
   [cmd.guild?.id],
   {
    returnType: 'blacklist',
    asArray: false,
   },
  )
  .then((r) => r ?? ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name));

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
  description: `${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.usestrike.name,
    value: embedParsers.boolean(settings?.usestrike, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.repostenabled.name,
    value: embedParsers.boolean(settings?.repostenabled, language),
    inline: false,
   },
   {
    name: lan.fields.repostroles.name,
    value: embedParsers.roles(settings?.repostroles, language),
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
   buttonParsers.global(language, !!settings?.active, 'active', name, undefined),
   buttonParsers.boolean(language, settings?.usestrike, 'usestrike', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.repostenabled, 'repostenabled', name, undefined),
   buttonParsers.specific(language, settings?.repostroles, 'repostroles', name, undefined, 'role'),
  ],
 },
];
