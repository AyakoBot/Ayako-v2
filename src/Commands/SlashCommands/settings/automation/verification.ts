import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Verification;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
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
  description: client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]
   ?.length
   ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
      name as keyof typeof client.util.constants.tutorials
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
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.kicktof.name,
    value: embedParsers.boolean(settings?.kicktof, language),
    inline: true,
   },
   ...(settings?.kicktof
    ? [
       {
        name: lan.fields.kickafter.name,
        value: embedParsers.time(Number(settings?.kickafter) * 1000, language),
        inline: true,
       },
      ]
    : []),
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
   buttonParsers.global(language, !!settings?.active, CT.GlobalDescType.Active, name, undefined),
  ],
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
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(
    language,
    settings?.logchannel,
    'logchannel',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.pendingrole,
    'pendingrole',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.finishedrole,
    'finishedrole',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.boolean(language, settings?.kicktof, 'kicktof', name, undefined),
   ...(settings?.kicktof
    ? [buttonParsers.specific(language, settings?.kickafter, 'kickafter', name, undefined)]
    : []),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 _oldSettings,
 newSettings,
 changedSettings,
) => {
 switch (changedSettings) {
  case 'startchannel': {
   if (!newSettings?.startchannel) return;
   const channel = await client.util.getChannel.guildTextChannel(newSettings.startchannel);
   if (!channel) return;

   const language = await client.util.getLanguage(channel.guildId);
   client.util.send(channel, await getPayload(language, channel.guild));
   break;
  }
  default: {
   break;
  }
 }
};

export const getPayload = async (
 language: CT.Language,
 guild: Discord.Guild,
): Promise<CT.UsualMessagePayload> => ({
 embeds: [
  {
   author: {
    name: language.verification.title,
    icon_url: client.util.emotes.tickWithBackground.link,
   },
   description: language.verification.startchannelmessage,
   color: client.util.getColor(await client.util.getBotMemberFromGuild(guild)),
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
