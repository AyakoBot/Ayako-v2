import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings';

const name = 'basic';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
 const { embedParsers, buttonParsers } = ch.settingsHelpers;

 const settings = await ch
  .query(
   `SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`,
   [cmd.guild?.id],
   {
    returnType: 'guildsettings',
    asArray: false,
   },
  )
  .then((r) => r ?? ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name));
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
  fields: [
   {
    name: lan.fields.prefix.name,
    value: settings?.prefix ? `\`${settings?.prefix}\`` : language.None,
    inline: true,
   },

   {
    name: lan.fields.ptreminderenabled.name,
    value: embedParsers.boolean(settings?.ptreminderenabled, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.interactionsmode.name,
    value: settings?.interactionsmode ? `${language.small}` : `${language.large}`,
    inline: true,
   },
   {
    name: lan.fields.legacyrp.name,
    value: embedParsers.boolean(settings?.legacyrp, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.lan.name,
    value: settings?.lan
     ? language.languages[settings.lan as keyof typeof language.languages]
     : language.languages.en,
    inline: true,
   },
   {
    name: lan.fields.errorchannel.name,
    value: embedParsers.channel(settings?.errorchannel, language),
    inline: true,
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
   buttonParsers.specific(language, settings?.prefix, 'prefix', name, undefined),
   buttonParsers.boolean(
    language,
    settings?.ptreminderenabled,
    'ptreminderenabled',
    name,
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.interactionsmode, 'interactionsmode', name, undefined),
   buttonParsers.boolean(language, settings?.legacyrp, 'legacyrp', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.lan, 'lan', name, undefined),
   buttonParsers.specific(
    language,
    settings?.errorchannel,
    'errorchannel',
    name,
    undefined,
    'channel',
   ),
  ],
 },
];
