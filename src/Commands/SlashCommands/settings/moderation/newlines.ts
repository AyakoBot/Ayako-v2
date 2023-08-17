import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'newlines';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
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
  description: `${
   ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
       name as keyof typeof ch.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.maxnewlines.name,
    value: embedParsers.number(settings?.maxnewlines, language),
    inline: true,
   },
   {
    name: lan.fields.action.name,
    value: settings?.action
     ? language.punishments[settings?.action as keyof typeof language.punishments]
     : language.None,
    inline: true,
   },
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.action)
    ? [
       {
        name: lan.fields.duration.name,
        value: embedParsers.time(Number(settings?.duration) * 1000, language),
        inline: true,
       },
      ]
    : []),
   ...(['ban', 'softban', 'tempban'].includes(settings?.action)
    ? [
       {
        name: lan.fields.deletemessageseconds.name,
        value: embedParsers.time(Number(settings?.deletemessageseconds) * 1000, language),
        inline: true,
       },
      ]
    : []),
   {
    name: language.slashCommands.settings.wlchannel,
    value: embedParsers.channels(settings?.wlchannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.wlrole,
    value: embedParsers.roles(settings?.wlroleid, language),
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
  components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.maxnewlines, 'maxnewlines', name, undefined),
   buttonParsers.specific(language, settings?.action, 'action', name, undefined),
   ...(['tempmute', 'tempchannelban', 'tempban'].includes(settings?.action)
    ? [buttonParsers.specific(language, settings?.duration, 'duration', name, undefined)]
    : []),
   ...(['tempban', 'softban', 'ban'].includes(settings?.action)
    ? [
       buttonParsers.specific(
        language,
        settings?.deletemessageseconds,
        'deletemessageseconds',
        name,
        undefined,
       ),
      ]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, settings?.wlchannelid, 'wlchannelid', name, undefined),
   buttonParsers.global(language, settings?.wlroleid, 'wlroleid', name, undefined),
  ],
 },
];
