import * as Discord from 'discord.js';
import DiscordAPI from 'discord-api-types/v10';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../BaseClient/Other/constants.js';
import requestHandler from '../../../BaseClient/ClientHelperModules/requestHandler.js';
import { create } from '../../ButtonCommands/rp/toggle.js';
import Lang from '../../../BaseClient/Other/language.js';
import { registerCmd } from '../../ButtonCommands/mod/permissions.js';

const name = 'basic';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const { embedParsers, buttonParsers } = ch.settingsHelpers;

 const settings = await ch.DataBase[TableNamesPrismaTranslation[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    ch.DataBase[TableNamesPrismaTranslation[name]].create({
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
   (await ch.getCustomCommand(guild, 'rp'))?.id ?? '0',
  )}\n${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
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
    name: lan.fields.errorchannel.name,
    value: embedParsers.channel(settings?.errorchannel, language),
    inline: true,
   },
   {
    name: lan.fields.token.name,
    value: settings.token
     ? `${ch.util.makeInlineCode(
        `${settings.token.split('.')[0]}.${'*'.repeat(
         settings.token.split('.')[1].length,
        )}.${'*'.repeat(settings.token.split('.')[2].length)}`,
       )}\n[${language.t.InviteCustomBot}](${ch.constants.standard.invite.replace(
        ch.mainID,
        settings.appid ?? ch.mainID,
       )})`
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
   buttonParsers.specific(
    language,
    settings?.errorchannel,
    'errorchannel',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings?.token, 'token', name, undefined),
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Link,
    label: language.t.InviteCustomBot,
    disabled: !settings.token,
    url: settings.token
     ? ch.constants.standard.invite.replace(ch.mainID, settings.appid ?? ch.mainID)
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
   if (!newSettings.token) {
    ch.cache.apis.delete(guild.id);
    ch.DataBase.guildsettings.update({
     where: { guildid: guild.id },
     data: { publickey: null, appid: null, token: null },
    });

    ch.request.commands.getGuildCommands(guild);
    ch.cache.commandPermissions.get(guild, '');
    return;
   }

   requestHandler(guild.id, newSettings.token);

   const me = await ch.cache.apis
    .get(guild.id)
    ?.rest.get(`/applications/${ch.getBotIdFromToken(newSettings.token)}`)
    .then((a) => a as DiscordAPI.APIApplication)
    .catch((e: Discord.DiscordAPIError) => e);

   if (!me || 'message' in me) {
    ch.error(guild, new Error(me ? me.message : 'Unknown Application'));

    ch.DataBase.guildsettings
     .update({
      where: { guildid: guild.id },
      data: { token: null },
      select: { enabledrp: true },
     })
     .then();

    return;
   }

   if (!me.bot_public) {
    ch.error(
     guild,
     new Error('Bot is not public, please make it public so it can use external Emojis'),
    );
    return;
   }

   ch.send(
    { id: '1024968281465040957', guildId: '669893888856817665' },
    {
     content: `New Custom Client <@318453143476371456>`,
     allowed_mentions: {
      users: ['318453143476371456'],
     },
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

   const language = new Lang('en');
   await language.init();

   const existingCommands = Object.values(language.slashCommands.moderation.permissions.buttons)
    .map((e) => guild.commands.cache.find((c) => c.name === e))
    .filter((c): c is Discord.ApplicationCommand => !!c)
    .map((c) => registerCmd(c.name as Parameters<typeof registerCmd>[0], guild))
    .filter((c): c is Discord.RESTPostAPIChatInputApplicationCommandsJSONBody => !!c);

   await ch.request.commands.bulkOverwriteGuildCommands(guild, [...existingCommands]);

   const settings = await ch.DataBase.guildsettings.update({
    where: { guildid: guild.id },
    data: { publickey: me.verify_key, appid: me.id },
    select: { enabledrp: true },
   });
   if (settings.enabledrp) await create(guild);

   ch.request.commands.getGuildCommands(guild);
   ch.cache.commandPermissions.get(guild, '');
   break;
  }
  default:
   break;
 }
};
