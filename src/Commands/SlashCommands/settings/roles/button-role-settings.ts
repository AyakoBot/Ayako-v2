import * as Discord from 'discord.js';
import client, { API } from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.ButtonRoleSettings;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
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

 const fields = settings?.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  value: `${lan.fields.msgid.name}: ${
   s.guildid && s.channelid && s.msgid
    ? client.util.constants.standard.msgurl(s.guildid, s.channelid, s.msgid)
    : language.t.None
  }`,
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
    name: lan.fields.msgid.name,
    value:
     settings.guildid && settings.channelid && settings.msgid
      ? client.util.constants.standard.msgurl(settings.guildid, settings.channelid, settings.msgid)
      : language.t.None,
    inline: true,
   },
   {
    name: lan.fields.onlyone.name,
    value: embedParsers.boolean(settings?.onlyone, language),
    inline: true,
   },
   {
    name: lan.fields.anyroles.name,
    value: embedParsers.roles(settings?.anyroles, language),
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
    settings?.msgid,
    'msgid',
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
   buttonParsers.specific(
    language,
    settings?.anyroles,
    'anyroles',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSettings,
 guild,
 uniquetimestamp,
) => {
 if (!newSettings) return;

 switch (changedSettings) {
  case 'active': {
   const settings = await client.util.DataBase.buttonrolesettings.findUnique({
    where: { uniquetimestamp },
   });
   if (!settings) return;

   const message = (await client.util.getMessage(
    client.util.constants.standard.msgurl(
     settings.guildid,
     settings.channelid ?? '',
     settings.msgid ?? '',
    ),
   )) as Discord.Message<true> | undefined;
   if (!message) return;

   switch (newSettings.active) {
    case true: {
     const relatedSettings = await client.util.DataBase.buttonroles.findMany({
      where: {
       linkedid: uniquetimestamp,
       active: true,
       roles: { isEmpty: false },
       OR: [{ emote: { not: null } }, { text: { not: null } }],
      },
     });
     if (!relatedSettings.length) return;

     const componentChunks: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] =
      client.util
       .getChunks(
        relatedSettings
         .map((s) => ({
          label: s.text ?? undefined,
          style: Discord.ButtonStyle.Secondary,
          emoji: s.emote ? (Discord.parseEmoji(s.emote) ?? undefined) : undefined,
          type: Discord.ComponentType.Button,
          custom_id: `roles/button-roles/takeRole_${s.uniquetimestamp}`,
         }))
         .filter((c) => c.label || c.emoji) as Discord.APIButtonComponentWithCustomId[],
        5,
       )
       .map((c) => ({
        type: Discord.ComponentType.ActionRow,
        components: c,
       }));

     if (message?.author.id === guild.client.user.id) {
      API.channels.editMessage(message.channelId, message.id, { components: componentChunks });
     } else {
      client.util.request.channels.editMessage(guild, message.channelId, message.id, {
       components: componentChunks,
      });
     }
     break;
    }
    case false: {
     if (!message.components.length) return;

     if (message?.author.id === guild.client.user.id) {
      API.channels.editMessage(message.channelId, message.id, { components: [] });
     } else {
      client.util.request.channels.editMessage(guild, message.channelId, message.id, {
       components: [],
      });
     }
     break;
    }
    default: {
     break;
    }
   }
   break;
  }
  case 'msgid': {
   const settings = await client.util.DataBase.buttonrolesettings.findUnique({
    where: { uniquetimestamp },
   });
   if (!settings) return;

   const message = await client.util.getMessage(
    client.util.constants.standard.msgurl(
     settings.guildid,
     settings.channelid ?? '',
     settings.msgid ?? '',
    ),
   );

   if (!message) return;
   if (message.author.id === guild.client.user.id) return;
   if (message.author.id === (await client.util.getBotIdFromGuild(guild))) return;

   client.util.error(
    guild,
    new Error("button-roles: Message has to be sent by me, else I can't edit it"),
   );
   break;
  }
  default: {
   break;
  }
 }
};
