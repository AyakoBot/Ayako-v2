import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { TableNamesPrismaTranslation } from '../../../../BaseClient/Other/constants.js';

const name = 'verification';

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
  description: ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
   ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
      name as keyof typeof ch.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.selfstart.name,
    value: embedParsers.boolean(settings?.selfstart, language),
    inline: true,
   },
   {
    name: lan.fields.startchannel.name,
    value: embedParsers.channel(settings?.startchannel, language),
    inline: true,
   },
   {
    name: lan.fields.logchannel.name,
    value: embedParsers.channel(settings?.logchannel, language),
    inline: true,
   },
   {
    name: lan.fields.pendingrole.name,
    value: embedParsers.role(settings?.pendingrole, language),
    inline: true,
   },
   {
    name: lan.fields.finishedrole.name,
    value: embedParsers.role(settings?.finishedrole, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.kicktof.name,
    value: embedParsers.boolean(settings?.kicktof, language),
    inline: false,
   },
   {
    name: lan.fields.kickafter.name,
    value: embedParsers.time(Number(settings?.kickafter), language),
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
   buttonParsers.boolean(language, settings?.selfstart, 'selfstart', name, undefined),
   buttonParsers.specific(
    language,
    settings?.startchannel,
    'startchannel',
    name,
    undefined,
    'channel',
   ),
   buttonParsers.specific(language, settings?.logchannel, 'logchannel', name, undefined, 'channel'),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings?.pendingrole, 'pendingrole', name, undefined, 'role'),
   buttonParsers.specific(
    language,
    settings?.finishedrole,
    'finishedrole',
    name,
    undefined,
    'role',
   ),
   buttonParsers.boolean(language, settings?.kicktof, 'kicktof', name, undefined),
   buttonParsers.specific(language, settings?.kickafter, 'kickafter', name, undefined),
  ],
 },
];

export const postChange: CT.SettingsFile<'verification'>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSettings,
) => {
 switch (changedSettings) {
  case 'startchannel': {
   if (!newSettings?.startchannel) return;
   const channel = await ch.getChannel.guildTextChannel(newSettings.startchannel);
   if (!channel) return;

   const language = await ch.languageSelector(channel.guildId);

   channel.send({
    embeds: [
     {
      author: {
       name: language.verification.title,
       icon_url: ch.objectEmotes.tickWithBackground.link,
      },
      description: language.verification.startchannelmessage,
      color: ch.colorSelector(await ch.getBotMemberFromGuild(channel.guild)),
     },
    ],
    components: [
     {
      type: Discord.ComponentType.ActionRow,
      components: [
       {
        type: Discord.ComponentType.Button,
        custom_id: 'verification/verify',
        label: language.verification.verify,
        style: Discord.ButtonStyle.Primary,
       },
      ],
     },
    ],
   });
   break;
  }
  default: {
   break;
  }
 }
};
