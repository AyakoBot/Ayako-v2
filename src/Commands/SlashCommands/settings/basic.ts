import * as Discord from 'discord.js';
import DiscordAPI from 'discord-api-types/v10';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../BaseClient/Other/constants.js';
import requestHandler from '../../../BaseClient/ClientHelperModules/requestHandler.js';

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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${language.slashCommands.rp.notice}\n${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: lan.fields.prefix.name,
    value: settings?.prefix ? `\`${settings?.prefix}\`` : language.None,
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
    value: settings?.interactionsmode ? `${language.small}` : `${language.large}`,
    inline: true,
   },
   {
    name: lan.fields.legacyrp.name,
    value: embedParsers.boolean(settings?.legacyrp, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.lan.name,
    value: settings?.lan
     ? language.languages[settings.lan as keyof typeof language.languages]
     : language.languages.en,
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
     ? ch.util.makeInlineCode(`${'*'.repeat(settings.token.length - 5)}${settings.token.slice(-3)}`)
     : language.None,
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
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSetting,
 guild,
) => {
 switch (changedSetting) {
  case 'token': {
   if (!newSettings.token) {
    ch.cache.apis.delete(guild.id);
    ch.DataBase.guildsettings.update({
     where: { guildid: guild.id },
     data: { publickey: null, appid: null, token: null },
    });
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
     content: `New Custom Client`,
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

   ch.DataBase.guildsettings
    .update({
     where: { guildid: guild.id },
     data: { publickey: me.verify_key, appid: me.id },
    })
    .then();
   break;
  }
  default:
   break;
 }
};
