import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'reaction-role-settings';

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
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  value: `${lan.fields.msgid.name}: ${
   s.guildid && s.channelid && s.msgid
    ? ch.constants.standard.msgurl(s.guildid, s.channelid, s.msgid)
    : language.None
  }`,
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
    name: lan.fields.msgid.name,
    value:
     settings.guildid && settings.channelid && settings.msgid
      ? ch.constants.standard.msgurl(settings.guildid, settings.channelid, settings.msgid)
      : language.None,
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
    'role',
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<'reaction-role-settings'>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSettings,
 guild,
 uniquetimestamp,
) => {
 switch (changedSettings) {
  case 'active': {
   switch (newSettings.active) {
    case true: {
     const settings = await ch.DataBase.reactionrolesettings.findUnique({
      where: { uniquetimestamp },
     });
     if (!settings) return;

     const relatedSettings = await ch.DataBase.reactionroles.findMany({
      where: {
       linkedid: uniquetimestamp,
       active: true,
       roles: { isEmpty: false },
       emote: { not: null },
      },
     });
     if (!relatedSettings.length) return;

     const message = (await ch.getMessage(
      ch.constants.standard.msgurl(
       settings.guildid,
       settings.channelid ?? '',
       settings.msgid ?? '',
      ),
     )) as Discord.Message<true> | undefined;
     if (!message) return;

     const emotes = relatedSettings
      .map((s) => Discord.parseEmoji(s.emote as string))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .map((e) => ch.constants.standard.getEmoteIdentifier(e));

     const noAccessEmotes = (
      await Promise.all(
       relatedSettings.map((s) =>
        (s.emote as string).includes(':') ? ch.getEmote(s.emote as string) : true,
       ),
      )
     )
      .map((e, i) => (e ? false : relatedSettings[i].emote))
      .filter((e): e is string => !!e);

     emotes
      .filter((e) => !noAccessEmotes.includes(e))
      .forEach((e) => {
       ch.request.channels.addReaction(message, e);
      });

     if (noAccessEmotes.length) {
      ch.error(
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
     const settings = await ch.DataBase.reactionrolesettings.findUnique({
      where: { uniquetimestamp },
     });
     if (!settings) return;

     const message = await ch.getMessage(
      ch.constants.standard.msgurl(
       settings.guildid,
       settings.channelid ?? '',
       settings.msgid ?? '',
      ),
     );

     if (!message) return;
     if (!message.reactions.cache.size) return;
     ch.request.channels.deleteAllReactions(message as Discord.Message<true>);
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
