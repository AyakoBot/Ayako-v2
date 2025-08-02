import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import { getURLs } from '../../../../Events/BotEvents/messageEvents/messageCreate/antivirus.js';
import { convertTenorToGIF } from '../../../../Events/BotEvents/messageEvents/messageCreate/welcomeGifChannel.js';

const name = CT.SettingNames.Welcome;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
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
  components: await getComponents(buttonParsers, settings, language, cmd.guild),
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
    name: lan.fields.channelid.name,
    value: embedParsers.channel(settings?.channelid, language),
    inline: true,
   },
   {
    name: lan.fields.embed.name,
    value: await embedParsers.embed(settings?.embed, language),
    inline: true,
   },
   {
    name: lan.fields.gifChannelId.name,
    value: embedParsers.channel(settings?.gifChannelId, language),
    inline: true,
   },
   {
    name: lan.fields.pingjoin.name,
    value: embedParsers.boolean(settings?.pingjoin, language),
    inline: true,
   },
   {
    name: lan.fields.pingroles.name,
    value: embedParsers.roles(settings?.pingroles, language),
    inline: false,
   },
   {
    name: lan.fields.pingusers.name,
    value: embedParsers.users(settings?.pingusers, language),
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
   buttonParsers.global(language, !!settings?.active, CT.GlobalDescType.Active, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.channelid,
    'channelid',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.specific(language, settings?.embed, 'embed', name, undefined),
   buttonParsers.specific(
    language,
    settings?.gifChannelId,
    'gifChannelId',
    name,
    undefined,
    CT.EditorTypes.Channel,
   ),
   buttonParsers.boolean(language, settings?.pingjoin, 'pingjoin', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings?.pingroles,
    'pingroles',
    name,
    undefined,
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.pingusers,
    'pingusers',
    name,
    undefined,
    CT.EditorTypes.User,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Success,
    custom_id: 'events/guildMemberAdd_welcome',
    label: language.events.guildMemberAdd.welcome.test,
   },
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 oldSetting,
 newSetting,
 changedSetting,
 guild,
) => {
 if (changedSetting !== 'gifChannelId') return;
 if (newSetting?.gifChannelId === oldSetting?.gifChannelId) return;

 await client.util.DataBase.welcomeGIF.deleteMany({ where: { guildId: guild.id } });
 if (!newSetting?.gifChannelId) return;

 const channel = guild.channels.cache.get(newSetting.gifChannelId);
 if (!channel || !channel.isTextBased()) return;

 const messages = await guild.client.util.fetchMessages(channel, { amount: 500 });
 if (!messages.length) return;

 const contentURLs = await Promise.all(
  messages.map((m) => getURLs(m.content).then((urls) => urls.map((url) => ({ url, id: m.id })))),
 );

 const videoURLs = messages
  .map((m) => m.embeds?.map((e) => ({ url: convertTenorToGIF(e.video?.url), id: m.id })).flat())
  .flat()
  .filter((u): u is { url: string; id: string } => !!u.url?.length);

 await client.util.DataBase.welcomeGIF.createMany({
  data: [
   ...messages.map((m) => m.attachments.map((a) => ({ url: a.url, id: m.id }))).flat(),
   ...contentURLs.flat(3),
   ...videoURLs,
  ]
   .filter((u) => !!u.url && !u.url.includes('tenor.com/view'))
   .map((m) => ({
    guildId: guild.id,
    channelId: channel.id,
    msgId: m.id,
    url: m.url,
   })),
 });
};
