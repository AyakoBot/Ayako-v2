import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'sticky';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
   ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
      name as keyof typeof ch.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  fields: [
   {
    name: lan.fields.stickypermsactive.name,
    value: embedParsers.boolean(settings?.stickypermsactive, language),
    inline: true,
   },
   {
    name: lan.fields.stickyrolesactive.name,
    value: embedParsers.boolean(settings?.stickyrolesactive, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.stickyrolesmode.name,
    value: settings?.stickyrolesmode
     ? `${ch.constants.standard.getEmote(ch.emotes.enabled)} ${lan.unsticky}`
     : `${ch.constants.standard.getEmote(ch.emotes.disabled)} ${lan.sticky}`,
    inline: false,
   },
   {
    name: lan.fields.roles.name,
    value: embedParsers.roles(settings?.roles, language),
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
   buttonParsers.boolean(
    language,
    settings?.stickypermsactive,
    'stickypermsactive',
    name,
    undefined,
   ),
   buttonParsers.boolean(
    language,
    settings?.stickyrolesactive,
    'stickyrolesactive',
    name,
    undefined,
   ),
   buttonParsers.specific(language, settings?.stickyrolesmode, 'stickyrolesmode', name, undefined),
   buttonParsers.specific(language, settings?.roles, 'roles', name, undefined, 'role'),
  ],
 },
];
