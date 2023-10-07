import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'expiry';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = ch.settingsHelpers;
 const settings = await ch.DataBase[TableNamesPrismaTranslation[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    ch.DataBase[TableNamesPrismaTranslation[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${lan.desc((await ch.getCustomCommand(settings.guildid, 'check'))?.id ?? '0')}\n${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: lan.fields.bans.name,
    value: embedParsers.boolean(settings?.bans, language),
    inline: true,
   },
   {
    name: lan.fields.banstime.name,
    value: embedParsers.time(Number(settings?.banstime) * 1000, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.channelbans.name,
    value: embedParsers.boolean(settings?.channelbans, language),
    inline: true,
   },
   {
    name: lan.fields.channelbanstime.name,
    value: embedParsers.time(Number(settings?.channelbanstime) * 1000, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.kicks.name,
    value: embedParsers.boolean(settings?.kicks, language),
    inline: true,
   },
   {
    name: lan.fields.kickstime.name,
    value: embedParsers.time(Number(settings?.kickstime) * 1000, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.mutes.name,
    value: embedParsers.boolean(settings?.mutes, language),
    inline: true,
   },
   {
    name: lan.fields.mutestime.name,
    value: embedParsers.time(Number(settings?.mutestime) * 1000, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.warns.name,
    value: embedParsers.boolean(settings?.warns, language),
    inline: true,
   },
   {
    name: lan.fields.warnstime.name,
    value: embedParsers.time(Number(settings?.warnstime) * 1000, language),
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
   buttonParsers.boolean(language, settings?.bans, 'bans', name, undefined),
   buttonParsers.boolean(language, settings?.channelbans, 'channelbans', name, undefined),
   buttonParsers.boolean(language, settings?.kicks, 'kicks', name, undefined),
   buttonParsers.boolean(language, settings?.mutes, 'mutes', name, undefined),
   buttonParsers.boolean(language, settings?.warns, 'warns', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.banstime, 'banstime', name, undefined),
   buttonParsers.specific(language, settings?.channelbanstime, 'channelbanstime', name, undefined),
   buttonParsers.specific(language, settings?.kickstime, 'kickstime', name, undefined),
   buttonParsers.specific(language, settings?.mutestime, 'mutestime', name, undefined),
   buttonParsers.specific(language, settings?.warnstime, 'warnstime', name, undefined),
  ],
 },
];
