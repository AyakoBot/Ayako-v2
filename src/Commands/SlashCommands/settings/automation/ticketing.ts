import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import { TicketType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library.js';

const name = CT.SettingNames.Ticketing;

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
  name: `${language.t.Type}: ${language.ticketingtype[s.type]} - ${
   ([TicketType.dmToThread, TicketType.Thread].includes(s.type) ? s.channelId : s.categoryId)
    ? (
       client.channels.cache.get(
        ([TicketType.dmToThread, TicketType.Thread].includes(s.type)
         ? s.channelId
         : s.categoryId) || '',
       ) as Discord.GuildTextBasedChannel | Discord.CategoryChannel
      )?.name || language.t.None
    : language.t.None
  }`,
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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
 guild,
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
    inline: true,
   },
   {
    name: lan.fields.type.name,
    value: language.ticketingtype[settings?.type] ?? language.t.None,
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   ...([TicketType.Thread, TicketType.dmToThread].includes(settings.type)
    ? [
       {
        name: lan.fields.channelId.name,
        value: embedParsers.channel(settings?.channelId, language),
        inline: true,
       },
       {
        name: lan.fields.archiveDuration.name,
        value: guild.channels.cache.get(settings?.channelId || '')
         ? embedParsers.time(
            ((guild.channels.cache.get(settings.channelId!) as Discord.BaseGuildTextChannel)
             ?.defaultAutoArchiveDuration || Discord.ThreadAutoArchiveDuration.ThreeDays) * 60000,
            language,
           )
         : '-',
        inline: true,
       },
      ]
    : []),
   ...([TicketType.Channel, TicketType.dmToChannel].includes(settings.type)
    ? [
       {
        name: lan.fields.categoryId.name,
        value: embedParsers.channel(settings?.categoryId, language),
        inline: true,
       },
       {
        name: lan.fields.archiveCategoryId.name,
        value: embedParsers.channel(settings?.archiveCategoryId, language),
        inline: true,
       },
      ]
    : []),
   ...([TicketType.dmToThread, TicketType.dmToChannel].includes(settings.type)
    ? [
       {
        name: lan.fields.sendMessagePrefixes.name,
        value: settings?.sendMessagePrefixes.length
         ? settings.sendMessagePrefixes
            .map((p) => guild.client.util.util.makeInlineCode(p))
            .join(', ')
         : language.t.None,
        inline: true,
       },
      ]
    : []),
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.mentionRoles.name,
    value: embedParsers.roles(settings?.mentionRoles, language),
    inline: false,
   },
   {
    name: lan.fields.mentionUsers.name,
    value: embedParsers.users(settings?.mentionUsers, language),
    inline: false,
   },
   {
    name: lan.fields.logChannelIds.name,
    value: embedParsers.channels(settings?.logChannelIds, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
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
 guild,
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
   buttonParsers.specific(
    language,
    settings?.type,
    'type',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   ...([TicketType.Thread, TicketType.dmToThread].includes(settings.type)
    ? [
       buttonParsers.specific(
        language,
        settings.channelId,
        'channelId',
        name,
        Number(settings?.uniquetimestamp),
        CT.EditorTypes.Channel,
       ),
       buttonParsers.specific(
        language,
        new Decimal(
         (guild.channels.cache.get(settings.channelId!) as Discord.BaseGuildTextChannel)
          ?.defaultAutoArchiveDuration || Discord.ThreadAutoArchiveDuration.ThreeDays,
        ),
        'archiveDuration',
        name,
        Number(settings?.uniquetimestamp),
       ),
      ]
    : []),
   ...([TicketType.Channel, TicketType.dmToChannel].includes(settings.type)
    ? [
       buttonParsers.specific(
        language,
        settings.categoryId,
        'categoryId',
        name,
        Number(settings?.uniquetimestamp),
        CT.EditorTypes.Channel,
       ),
       buttonParsers.specific(
        language,
        settings.archiveCategoryId,
        'archiveCategoryId',
        name,
        Number(settings?.uniquetimestamp),
        CT.EditorTypes.Channel,
       ),
      ]
    : []),
   ...([TicketType.dmToThread, TicketType.dmToChannel].includes(settings.type)
    ? [
       buttonParsers.specific(
        language,
        settings.sendMessagePrefixes,
        'sendMessagePrefixes',
        name,
        Number(settings?.uniquetimestamp),
       ),
      ]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.mentionRoles,
    'mentionRoles',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.mentionUsers,
    'mentionUsers',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.User,
   ),

   buttonParsers.specific(
    language,
    settings?.logChannelIds,
    'logChannelIds',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Channel,
   ),

   buttonParsers.global(
    language,
    settings?.blroleid,
    CT.GlobalDescType.BLRoleId,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.bluserid,
    CT.GlobalDescType.BLUserId,
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Success,
    custom_id: `tickets/sendInit_${Number(settings?.uniquetimestamp)}`,
    label: language.slashCommands.settings.categories.ticketing.sendInit,
   },
  ],
 },
];
