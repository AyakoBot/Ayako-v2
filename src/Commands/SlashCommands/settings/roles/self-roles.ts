import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'self-roles';

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
  name: `${lan.fields.name.name}: \`${s.name ?? language.t.None}\``,
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
) => [
 {
  footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
  description: ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
   ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
      name as keyof typeof ch.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  author: embedParsers.author(language, lan),
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.name.name,
    value: settings?.name ?? language.t.None,
    inline: true,
   },
   {
    name: lan.fields.onlyone.name,
    value: embedParsers.boolean(settings?.onlyone, language),
    inline: true,
   },
   {
    name: lan.fields.roles.name,
    value: embedParsers.roles(settings?.roles, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.blrole,
    value: embedParsers.roles(settings?.blroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.bluser,
    value: embedParsers.roles(settings?.bluserid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.wlrole,
    value: embedParsers.roles(settings?.wlroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.wluser,
    value: embedParsers.roles(settings?.wluserid, language),
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
   buttonParsers.back(name, undefined),
   buttonParsers.global(
    language,
    !!settings?.active,
    'active',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.name,
    'name',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.boolean(
    language,
    settings?.onlyone,
    'onlyone',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.roles,
    'roles',
    name,
    Number(settings?.uniquetimestamp),
    'role',
   ),
   buttonParsers.global(
    language,
    settings?.blroleid,
    'blroleid',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.bluserid,
    'bluserid',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.wlroleid,
    'wlroleid',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.wluserid,
    'wluserid',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];
