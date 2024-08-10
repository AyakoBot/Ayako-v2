import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import { API } from '@discordjs/core';
import { sendDebugMessage } from '../../../../BaseClient/UtilModules/error.js';

const name = CT.SettingNames.LinkedRolesDeco;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];

 const id = cmd.options.get('id', false)?.value as string;
 if (id) {
  showId(cmd, id, language, lan);
  return;
 }
 showAll(cmd, language, lan);
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
     id ? parseInt(id, 36) : Date.now(),
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
) => {
 const { embedParsers, multiRowHelpers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings?.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\` - ${
   lan.fields.roleId.name
  }: \`${embedParsers.role(s.roleId, language)}\``,
  value: `${lan.fields.botId.name}: ${embedParsers.user(s.botId, language)}`,
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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
  description: `${lan.desc(settings.guildid, Number(settings.uniquetimestamp))}\n\n${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  author: embedParsers.author(language, lan),
  fields: [
   {
    name: lan.fields.roleId.name,
    value: embedParsers.role(settings?.roleId, language),
    inline: false,
   },
   {
    name: lan.fields.allowedUsers.name,
    value: embedParsers.users(settings?.allowedUsers, language),
    inline: false,
   },
   {
    name: lan.fields.botId.name,
    value: settings?.botId ? embedParsers.user(settings.botId, language) : language.t.None,
    inline: true,
   },
   {
    name: lan.fields.botSecret.name,
    value: settings?.botSecret
     ? Discord.inlineCode(embedParsers.string('*'.repeat(settings.botSecret.length), language))
     : language.t.None,
    inline: true,
   },
   {
    name: lan.fields.botToken.name,
    value: settings?.botToken
     ? Discord.inlineCode(
        `${settings.botToken.split('.')[0]}.${'*'.repeat(
         settings.botToken.split('.')[1].length,
        )}.${'*'.repeat(settings.botToken.split('.')[2].length)}`,
       )
     : language.t.None,
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
   buttonParsers.specific(
    language,
    settings?.roleId,
    'roleId',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.allowedUsers,
    'allowedUsers',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.User,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.botId,
    'botId',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.User,
   ),
   buttonParsers.specific(
    language,
    settings?.botSecret,
    'botSecret',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.botToken,
    'botToken',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 oldSettings,
 newSettings,
 changedSetting,
 guild,
 uniquetimestamp,
) => {
 if (!newSettings) return;

 switch (changedSetting) {
  case 'botId': {
   if (!newSettings.botId) return;
   if (newSettings.botSecret) return;
   if (newSettings.botToken) return;

   const cc = await guild.client.util.DataBase.customclients.findUnique({
    where: { guildid: guild.id, appid: newSettings.botId },
   });
   if (!cc) return;
   if (!cc.secret && !cc.token) return;

   await guild.client.util.DataBase.linkedRolesDeco.update({
    where: { uniquetimestamp },
    data: { botSecret: cc.secret, botToken: cc.token },
   });

   return;
  }
  case 'botToken': {
   if (!newSettings.botToken?.length) return;

   tokenCreate(guild, newSettings as Parameters<typeof tokenCreate>[1]);
   return;
  }
  case 'allowedUsers': {
   if (!newSettings.botId) return;
   if (!newSettings.botSecret) return;

   const removedUsers = oldSettings?.allowedUsers?.filter(
    (u) => !newSettings.allowedUsers?.includes(u),
   );

   removedUsers?.forEach((u) => {
    revokeToken(guild, u, { id: newSettings.botId!, secret: newSettings.botSecret! });
   });

   return;
  }
  default: {
   break;
  }
 }
};

const revokeToken = async (
 guild: Discord.Guild,
 userId: string,
 bot: { id: string; secret: string },
) => {
 const tokens = await guild.client.util.DataBase.linkedRoleTokens.findUnique({
  where: { botId_userId: { botId: bot.id, userId } },
 });
 if (!tokens) return;

 const success = await guild.client.rest
  .post(Discord.Routes.oauth2TokenRevocation(), {
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
   },
   body: Discord.makeURLSearchParams({
    token: tokens.token,
    token_type_hint: 'refresh_token',
    client_id: bot.id,
    client_secret: bot.secret,
   }),
   auth: false,
   passThroughBody: true,
  })
  .catch((e) => {
   sendDebugMessage({ content: JSON.stringify(e, null, 2) });
   return false;
  });

 if (!success) return;

 guild.client.util.DataBase.linkedRoleTokens
  .delete({
   where: { botId_userId: { botId: bot.id, userId } },
  })
  .then();
};

const tokenCreate = async (
 guild: Discord.Guild,
 newSettings: CT.MakeRequired<
  NonNullable<Parameters<NonNullable<CT.SettingsFile<typeof name>['postChange']>>[1]>,
  'botToken'
 >,
) => {
 const me = await getMe(newSettings.botToken);
 if (!meIsValid(guild, Number(newSettings.uniquetimestamp), me.current)) return;

 await me.api.applications.editCurrent({
  role_connections_verification_url: `https://api.ayakobot.com/v1/guilds/${guild.id}/linked-roles/${newSettings.uniquetimestamp}/decoration`,
 });
};

const getMe = async (token: string) => {
 const api = new API(
  new Discord.REST({ version: '10', api: 'http://localhost:8080/api' }).setToken(token),
 );

 return { api, current: await api.applications.getCurrent() };
};

const meIsValid = (
 guild: Discord.Guild,
 uniquetimestamp: number,
 me: Awaited<ReturnType<typeof getMe>>['current'],
): me is Discord.APIApplication => {
 if (!me || 'message' in me) {
  client.util.error(
   guild,
   new Error(me?.message && typeof me.message === 'string' ? me.message : 'Unknown Application'),
  );

  deleteEntry(guild, uniquetimestamp);
  return false;
 }

 return true;
};

const deleteEntry = (guild: Discord.Guild, uniquetimestamp: number) => {
 guild.client.util.DataBase.linkedRolesDeco
  .update({
   where: { uniquetimestamp },
   data: { botToken: null },
  })
  .then();
};
