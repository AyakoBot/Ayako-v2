import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.VotePunish;

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
 page,
) => {
 const { multiRowHelpers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings.map((s) => ({
  name: `${lan.fields.roleId.name}: ${s.roleId ? `<@&${s.roleId}>` : language.t.None} - ${
   lan.fields.punishment.name
  }: \`${
   s.punishment
    ? language.punishments[s.punishment as keyof typeof language.punishments]
    : language.t.None
  }\``,
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
  cmd.update({ embeds, components });
  return;
 }
 cmd.reply({ embeds, components, ephemeral: true });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
  description: `${lan.description}\n${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  author: embedParsers.author(language, lan),
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings.active, language),
    inline: false,
   },
   {
    name: lan.fields.roleId.name,
    value: embedParsers.role(settings.roleId, language),
    inline: true,
   },
   {
    name: lan.fields.voteInitRoles.name,
    value: embedParsers.roles(settings.voteInitRoles, language),
    inline: true,
   },
   {
    name: lan.fields.channelIds.name,
    value: embedParsers.channels(settings.channelIds, language),
    inline: true,
   },
   {
    name: lan.fields.cooldown.name,
    value: embedParsers.time(settings.cooldown ? Number(settings.cooldown) * 1000 : null, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.reqRoles.name,
    value: embedParsers.roles(settings.reqRoles, language),
    inline: true,
   },
   {
    name: lan.fields.reqRoleAmount.name,
    value: embedParsers.number(settings.reqRoleAmount, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.punishment.name,
    value: settings.punishment
     ? language.punishments[settings.punishment as keyof typeof language.punishments]
     : language.t.None,
    inline: true,
   },
   ...(['tempmute', 'tempban', 'tempchannelban'].includes(settings.punishment)
    ? [
       {
        name: lan.fields.duration.name,
        value: embedParsers.time(Number(settings.duration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   ...(['tempban', 'ban', 'softban'].includes(settings.punishment)
    ? [
       {
        name: lan.fields.deleteMessageSeconds.name,
        value: embedParsers.time(Number(settings.deleteMessageSeconds) * 1000, language),
        inline: true,
       },
      ]
    : []),

   {
    name: language.slashCommands.settings.BLWL.blroleid,
    value: embedParsers.roles(settings?.blroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.bluserid,
    value: embedParsers.users(settings?.bluserid, language),
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
    !!settings.active,
    CT.GlobalDescType.Active,
    name,
    Number(settings.uniquetimestamp),
   ),
   buttonParsers.delete(language, name, Number(settings.uniquetimestamp)),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.roleId,
    'roleId',
    name,
    Number(settings.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings.voteInitRoles,
    'voteInitRoles',
    name,
    Number(settings.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings.channelIds,
    'channelIds',
    name,
    Number(settings.uniquetimestamp),
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings.cooldown,
    'cooldown',
    name,
    Number(settings.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.reqRoles,
    'reqRoles',
    name,
    Number(settings.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings.reqRoleAmount,
    'reqRoleAmount',
    name,
    Number(settings.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.punishment,
    'punishment',
    name,
    Number(settings.uniquetimestamp),
   ),
   ...(['tempmute', 'tempban', 'tempchannelban'].includes(settings.punishment)
    ? [
       buttonParsers.specific(
        language,
        settings.duration,
        'duration',
        name,
        Number(settings.uniquetimestamp),
       ),
      ]
    : []),
   ...(['tempban', 'ban', 'softban'].includes(settings.punishment)
    ? [
       buttonParsers.specific(
        language,
        settings.deleteMessageSeconds,
        'deleteMessageSeconds',
        name,
        Number(settings.uniquetimestamp),
       ),
      ]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(
    language,
    settings?.bluserid,
    CT.GlobalDescType.BLUserId,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.blroleid,
    CT.GlobalDescType.BLRoleId,
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];
