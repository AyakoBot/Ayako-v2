import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'auto-punish';

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
  name: `${lan.fields.warnamount.name}: \`${s.warnamount ?? language.None}\` - ${
   lan.fields.punishment.name
  }: \`${
   s.punishment
    ? language.punishments[s.punishment as keyof typeof language.punishments]
    : language.None
  }\``,
  value: `${s.active ? ch.emotes.enabled : ch.emotes.disabled} - ID: \`${Number(
   s.uniquetimestamp,
  ).toString(36)}\``,
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
    name: lan.fields.warnamount.name,
    value: embedParsers.number(Number(settings?.warnamount), language),
    inline: true,
   },
   {
    name: lan.fields.punishment.name,
    value: settings?.punishment
     ? language.punishments[settings?.punishment as keyof typeof language.punishments]
     : language.None,
    inline: true,
   },
   ...(['tempmute', 'tempban', 'tempchannelban'].includes(settings.punishment)
    ? [
       {
        name: lan.fields.duration.name,
        value: embedParsers.time(Number(settings?.duration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   ...(['tempban', 'ban', 'softban'].includes(settings.punishment)
    ? [
       {
        name: lan.fields.deletemessageseconds.name,
        value: embedParsers.time(Number(settings?.deletemessageseconds) * 1000, language),
        inline: true,
       },
      ]
    : []),
   {
    name: lan.fields.confirmationreq.name,
    value: embedParsers.boolean(settings?.confirmationreq, language),
    inline: true,
   },
   {
    name: lan.fields.punishmentawaittime.name,
    value: embedParsers.time(Number(settings?.punishmentawaittime) * 1000, language),
    inline: true,
   },
   {
    name: lan.fields.addroles.name,
    value: embedParsers.roles(settings?.addroles, language),
    inline: false,
   },
   {
    name: lan.fields.removeroles.name,
    value: embedParsers.roles(settings?.removeroles, language),
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
    settings?.warnamount,
    'warnamount',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.punishment,
    'punishment',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.duration,
    'duration',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(
    language,
    settings?.confirmationreq,
    'confirmationreq',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.punishmentawaittime,
    'punishmentawaittime',
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
    settings?.addroles,
    'addroles',
    name,
    Number(settings?.uniquetimestamp),
    'role',
   ),
   buttonParsers.specific(
    language,
    settings?.removeroles,
    'removeroles',
    name,
    Number(settings?.uniquetimestamp),
    'role',
   ),
  ],
 },
];
