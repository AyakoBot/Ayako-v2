import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Cooldowns;

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
 const { embedParsers, multiRowHelpers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings?.map((s) => ({
  name: `${lan.fields.command.name}: \`${s.command ?? language.t.None}\` - ${
   lan.fields.cooldown.name
  }: \`${embedParsers.time(s.cooldown ? Number(s.cooldown) * 1000 : null, language)}\``,
  value: `${
   s.active
    ? client.util.constants.standard.getEmote(client.util.emotes.enabled)
    : client.util.constants.standard.getEmote(client.util.emotes.disabled)
  } - ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
  description: client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]
   ?.length
   ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
      name as keyof typeof client.util.constants.tutorials
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
    name: lan.fields.command.name,
    value: await embedParsers.command(settings?.command, language),
    inline: true,
   },
   {
    name: lan.fields.cooldown.name,
    value: embedParsers.time(
     settings?.cooldown ? Number(settings.cooldown) * 1000 : null,
     language,
    ),
    inline: true,
   },
   {
    name: lan.fields.activechannelid.name,
    value: embedParsers.channels(settings?.activechannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wlchannelid,
    value: embedParsers.channels(settings?.wlchannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wlroleid,
    value: embedParsers.roles(settings?.wlroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wluserid,
    value: embedParsers.users(settings?.wluserid, language),
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
    settings?.command,
    'command',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.cooldown,
    'cooldown',
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
    settings?.activechannelid,
    'activechannelid',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Channel,
   ),
   buttonParsers.global(
    language,
    settings?.wlchannelid,
    CT.GlobalDescType.WLChannelId,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.wlroleid,
    CT.GlobalDescType.WLRoleId,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.wluserid,
    CT.GlobalDescType.WLUserId,
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];
