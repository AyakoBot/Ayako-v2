import DiscordAPI from 'discord-api-types/v10';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import Lang from '../../../BaseClient/Other/language.js';
import requestHandler from '../../../BaseClient/UtilModules/requestHandler.js';
import commands from '../../../SlashCommands/index.js';
import * as CT from '../../../Typings/Typings.js';
import { registerCmd } from '../../ButtonCommands/mod/permissions.js';
import { create } from '../../ButtonCommands/rp/toggle.js';

const name = CT.SettingNames.CustomClient;

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
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${lan.desc}\n\n${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: lan.fields.token.name,
    value: settings.token
     ? client.util.util.makeInlineCode(
        `${settings.token.split('.')[0]}.${'*'.repeat(
         settings.token.split('.')[1].length,
        )}.${'*'.repeat(settings.token.split('.')[2].length)}`,
       )
     : language.t.None,
   },
   {
    name: lan.fields.secret.name,
    value: settings.secret
     ? client.util.util.makeInlineCode('*'.repeat(settings.secret.length))
     : language.t.None,
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
   buttonParsers.specific(language, settings?.token, 'token', name, undefined),
   buttonParsers.specific(language, settings?.secret, 'secret', name, undefined),
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
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSetting,
 guild,
) => {
 if (!newSettings) return;

 switch (changedSetting) {
  case 'token': {
   if (!newSettings.token?.length) {
    client.util.cache.apis.delete(guild.id);
    client.util.DataBase.customclients
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
    client.util.DataBase.customclients
     .update({
      where: { guildid: guild.id },
      data: { token: null },
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

   const [, settings] = await client.util.DataBase.$transaction([
    client.util.DataBase.customclients.update({
     where: { guildid: guild.id },
     data: { publickey: me.verify_key, appid: me.id },
     select: {},
    }),
    client.util.DataBase.guildsettings.findUnique({
     where: { guildid: guild.id },
     select: { enabledrp: true },
    }),
   ]);
   if (settings?.enabledrp) await create(guild);

   client.util.request.commands.getGuildCommands(guild);
   client.util.cache.commandPermissions.get(guild, '');
   break;
  }

  default:
   break;
 }
};
