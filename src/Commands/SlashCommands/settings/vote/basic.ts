import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Vote;

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
  name: `${lan.fields.announcementchannel.name}: ${
   s.announcementchannel ? `<#${s.announcementchannel}>` : language.t.None
  }`,
  value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
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
) => [
 {
  footer: {
   text: `ID: ${Number(settings.uniquetimestamp).toString(36)}`,
  },
  author: embedParsers.author(language, lan),
  description: `${lan.desc}${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
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
    name: lan.fields.name.name,
    value: embedParsers.string(settings?.name, language),
    inline: true,
   },
   {
    name: lan.fields.reminders.name,
    value: embedParsers.boolean(settings?.reminders, language),
    inline: true,
   },
   {
    name: lan.fields.announcementchannel.name,
    value: embedParsers.channel(settings?.announcementchannel, language),
    inline: true,
   },
   {
    name: lan.fields.token.name,
    value: settings?.token ? client.util.util.makeSpoiler(settings.token) : language.t.None,
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
    CT.GlobalDescType.Active,
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
    settings?.reminders,
    'reminders',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.announcementchannel,
    'announcementchannel',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.token,
    'token',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];
