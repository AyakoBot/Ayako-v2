import DiscordAPI from 'discord-api-types/v10';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import Lang from '../../../BaseClient/Other/language.js';
import requestHandler from '../../../BaseClient/UtilModules/requestHandler.js';
import commands from '../../../SlashCommands/index.js';
import * as CT from '../../../Typings/Typings.js';
import { registerCmd } from '../../ButtonCommands/mod/permissions.js';
import { create } from '../../ButtonCommands/rp/toggle.js';
import languageCache from '../../../BaseClient/UtilModules/cache/bot/language.js';

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
  description: `${settings.token ? lan.tokenSetDesc : ''}\n\n${language.slashCommands.rp.notice(
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
    name: lan.fields.token.name,
    value: settings.token
     ? `${client.util.util.makeInlineCode(
        `${settings.token.split('.')[0]}.${'*'.repeat(
         settings.token.split('.')[1].length,
        )}.${'*'.repeat(settings.token.split('.')[2].length)}`,
       )}\n[${language.t.InviteCustomBot}](${client.util.constants.standard.invite.replace(
        process.env.mainId ?? '',
        settings.appid ?? process.env.mainId ?? '',
       )})`
     : language.t.None,
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
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.lan, 'lan', name, undefined),
   buttonParsers.specific(language, settings?.token, 'token', name, undefined),
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Link,
    label: language.t.InviteCustomBot,
    disabled: !settings.token,
    url: settings.token
     ? client.util.constants.standard.invite.replace(
        process.env.mainId ?? '',
        settings.appid ?? process.env.mainId ?? '',
       )
     : 'https://ayakobot.com',
   },
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
  case 'token': {
   if (!newSettings.token?.length) {
    client.util.cache.apis.delete(guild.id);
    client.util.DataBase.guildsettings
     .update({
      where: { guildid: guild.id },
      data: { publickey: null, appid: null, token: null },
     })
     .then();

    client.util.request.commands.getGuildCommands(guild);
    client.util.cache.commandPermissions.get(guild, '');
    return;
   }

   requestHandler(guild.id, newSettings.token);

   const me = await client.util.cache.apis
    .get(guild.id)
    ?.rest.get(`/applications/${client.util.getBotIdFromToken(newSettings.token)}`)
    .then((a) => a as DiscordAPI.APIApplication)
    .catch((e: Discord.DiscordAPIError) => e);

   const deleteEntry = () => {
    client.util.cache.apis.delete(guild.id);
    client.util.DataBase.guildsettings
     .update({
      where: { guildid: guild.id },
      data: { token: null },
      select: { enabledrp: true },
     })
     .then();
   };

   if (!me || 'message' in me) {
    client.util.error(guild, new Error(me ? me.message : 'Unknown Application'));

    deleteEntry();
    return;
   }

   if (me.bot_require_code_grant) {
    client.util.error(
     guild,
     new Error('Bot requires Code Grant, please disable this in the Developer Portal'),
    );

    deleteEntry();
    return;
   }

   if (!me.bot_public) {
    client.util.error(
     guild,
     new Error('Bot is not public, please make it public so it can use external Emojis'),
    );

    deleteEntry();

    return;
   }

   await client.fetchWebhook(
    process.env.alertWebhookId as string,
    process.env.alertWebhookToken as string,
   );

   client.util.request.webhooks.execute(
    guild,
    process.env.alertWebhookId ?? '',
    process.env.alertWebhookToken ?? '',
    {
     content: `New Custom Client <@${process.env.ownerId}> => ${me.id}`,
     allowed_mentions: { users: [process.env.ownerId ?? ''] },
     components: [
      {
       type: Discord.ComponentType.ActionRow,
       components: [
        {
         type: Discord.ComponentType.Button,
         style: Discord.ButtonStyle.Link,
         label: 'Invite',
         url: `https://discord.com/api/oauth2/authorize?client_id=${me.id}&scope=bot`,
        },
       ],
      },
     ],
    },
   );

   const language = new Lang('en-GB');

   await client.util.request.commands.bulkOverwriteGlobalCommands(
    guild,
    Object.values(commands.public).map((c) => c.toJSON()),
   );

   const existingCommands = Object.values(language.slashCommands.moderation.permissions.buttons)
    .map((e) => guild.commands.cache.find((c) => c.name === e))
    .filter((c): c is Discord.ApplicationCommand => !!c)
    .map((c) => registerCmd(c.name as Parameters<typeof registerCmd>[0], guild))
    .filter((c): c is Discord.RESTPostAPIChatInputApplicationCommandsJSONBody => !!c);

   await client.util.request.commands.bulkOverwriteGuildCommands(guild, [...existingCommands]);

   const settings = await client.util.DataBase.guildsettings.update({
    where: { guildid: guild.id },
    data: { publickey: me.verify_key, appid: me.id },
    select: { enabledrp: true },
   });
   if (settings.enabledrp) await create(guild);

   client.util.request.commands.getGuildCommands(guild);
   client.util.cache.commandPermissions.get(guild, '');
   break;
  }
  case 'lan': {
   languageCache.delete(guild);
   break;
  }
  default:
   break;
 }
};
