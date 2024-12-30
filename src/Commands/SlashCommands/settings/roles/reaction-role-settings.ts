import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.ReactionRoleSettings;

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
   const settings = await client.util.DataBase.reactionrolesettings.findUnique({
    where: { uniquetimestamp },
   });
   if (!settings) return;

   const message = (await client.util.getMessage(
    client.util.constants.standard.msgurl(
     settings.guildid,
     settings.channelid ?? '',
     settings.msgid ?? '',
    ),
   )) as Discord.Message<true>;
   if (!message) return;

   switch (newSettings.active) {
    case true: {
     const relatedSettings = await client.util.DataBase.reactionroles.findMany({
      where: {
       linkedid: uniquetimestamp,
       active: true,
       roles: { isEmpty: false },
       emote: { not: null },
      },
     });
     if (!relatedSettings.length) return;

     const emotes = relatedSettings
      .map((s) => Discord.parseEmoji(s.emote as string))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .map((e) => client.util.constants.standard.getEmoteIdentifier(e));

     const noAccessEmotes = (
      await Promise.all(
       relatedSettings.map((s) =>
        (s.emote as string).includes(':') ? client.util.getEmote(s.emote as string) : true,
       ),
      )
     )
      .map((e, i) => (e ? false : relatedSettings[i].emote))
      .filter((e): e is string => !!e);

     emotes
      .filter((e) => !noAccessEmotes.includes(e))
      .forEach((e) => {
       client.util.request.channels.addReaction(message, e);
      });

     if (noAccessEmotes.length) {
      client.util.error(
       guild,
       new Error(
        `reaction-roles: no access to emotes ${noAccessEmotes.join(
         ', ',
        )}\nPlease react with them manually`,
       ),
      );
     }
     break;
    }
    case false: {
     if (!message.reactions.cache.size) return;
     client.util.request.channels.deleteAllReactions(message as Discord.Message<true>);
     break;
    }
    default: {
     break;
    }
   }
   break;
  }
  default: {
   break;
  }
 }
};
