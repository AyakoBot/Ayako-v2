import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import languageCache from '../../../BaseClient/UtilModules/cache/bot/language.js';
import * as CT from '../../../Typings/Typings.js';

const name = CT.SettingNames.Basic;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;

 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 const lan = language.slashCommands.settings.categories[name];

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
 embedParsers,
 settings,
 language,
 lan,
 guild,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${language.slashCommands.rp.notice(
   (await client.util.getCustomCommand(guild, 'rp'))?.id ?? '0',
  )}\n${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: lan.fields.prefix.name,
    value: settings?.prefix ? `\`${settings?.prefix}\`` : language.t.None,
    inline: true,
   },

   {
    name: lan.fields.ptreminderenabled.name,
    value: embedParsers.boolean(settings?.ptreminderenabled, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.interactionsmode.name,
    value: settings?.interactionsmode ? `${language.t.small}` : `${language.t.large}`,
    inline: true,
   },
   {
    name: lan.fields.legacyrp.name,
    value: embedParsers.boolean(settings?.legacyrp, language),
    inline: true,
   },
   ...(!settings?.legacyrp
    ? [
       {
        name: lan.fields.editrpcommands.name,
        value: embedParsers.boolean(settings?.editrpcommands, language),
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
    name: lan.fields.lan.name,
    value: settings?.lan
     ? language.languages[settings.lan as keyof typeof language.languages]
     : language.languages['en-GB'],
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.errorchannel.name,
    value: embedParsers.channel(settings?.errorchannel, language),
    inline: true,
   },
   {
    name: lan.fields.statuschannel.name,
    value: embedParsers.channel(settings?.statuschannel, language),
    inline: true,
   },
   {
    name: lan.fields.updateschannel.name,
    value: embedParsers.channel(settings?.updateschannel, language),
    inline: true,
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
   buttonParsers.specific(language, settings?.prefix, 'prefix', name, undefined),
   buttonParsers.boolean(
    language,
    settings?.ptreminderenabled,
    'ptreminderenabled',
    name,
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(language, settings?.interactionsmode, 'interactionsmode', name, undefined),
   buttonParsers.boolean(language, settings?.legacyrp, 'legacyrp', name, undefined),
   ...(!settings?.legacyrp
    ? [buttonParsers.boolean(language, settings?.editrpcommands, 'editrpcommands', name, undefined)]
    : []),
   buttonParsers.specific(language, settings?.lan, 'lan', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.errorchannel,
    'errorchannel',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings?.statuschannel,
    'statuschannel',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings?.updateschannel,
    'updateschannel',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 oldSettings,
 newSettings,
 changedSetting,
 guild,
) => {
 if (!newSettings) return;

 switch (changedSetting) {
  case 'statuschannel': {
   if (!newSettings.statuschannel) {
    if (!oldSettings?.statuschannel) return;

    [
     ...(client.util.cache.webhooks.cache.get(guild.id)?.get(oldSettings.statuschannel)?.values() ??
      []),
    ]
     .filter((w) => w.isChannelFollower() && w.sourceChannel.id === process.env.statusChannelId)
     .map((w) => client.util.request.webhooks.delete(guild, w));
    return;
   }

   const channel = await client.util.getChannel.guildTextChannel(newSettings.statuschannel);
   if (!channel) return;

   const response = await client.util.request.channels.followAnnouncements(
    channel,
    process.env.statusChannelId ?? '',
   );
   if (!('message' in response)) return;

   client.util.error(
    guild,
    new Error(
     'Could not follow channel. Please adjust permissions as outlined above and re-set the channel',
    ),
   );
   return;
  }
  case 'updateschannel': {
   if (!newSettings.updateschannel) {
    if (!oldSettings?.updateschannel) return;

    [
     ...(client.util.cache.webhooks.cache
      .get(guild.id)
      ?.get(oldSettings.updateschannel)
      ?.values() ?? []),
    ]
     .filter((w) => w.isChannelFollower() && w.sourceChannel.id === process.env.updatesChannelId)
     .map((w) => client.util.request.webhooks.delete(guild, w));
    return;
   }

   const channel = await client.util.getChannel.guildTextChannel(newSettings.updateschannel);
   if (!channel) return;

   const response = await client.util.request.channels.followAnnouncements(
    channel,
    process.env.updatesChannelId ?? '',
   );
   if (!('message' in response)) return;

   client.util.error(
    guild,
    new Error(
     'Could not follow channel. Please adjust permissions as outlined above and re-set the channel',
    ),
   );
   return;
  }
  case 'lan': {
   languageCache.delete(guild);
   break;
  }
  default:
   break;
 }
};
