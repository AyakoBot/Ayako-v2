import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({ where: { guildid: cmd.guildId } })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.update({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
): Discord.APIEmbed[] => [
 {
  author: embedParsers.author(language, lan),
  fields: [
   {
    name: language.slashCommands.settings.BLWL.blchannelid,
    value: embedParsers.channels(settings.blchannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wlchannelid,
    value: embedParsers.channels(settings.wlchannelid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.blroleid,
    value: embedParsers.roles(settings.blroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wlroleid,
    value: embedParsers.roles(settings.wlroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.bluserid,
    value: embedParsers.users(settings.bluserid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.wluserid,
    value: embedParsers.users(settings.wluserid, language),
    inline: false,
   },
  ],
 },
];

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(
    language,
    settings.blchannelid,
    CT.GlobalDescType.BLChannelId,
    name,
    undefined,
   ),
   buttonParsers.global(
    language,
    settings.wlchannelid,
    CT.GlobalDescType.WLChannelId,
    name,
    undefined,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, settings.blroleid, CT.GlobalDescType.BLRoleId, name, undefined),
   buttonParsers.global(language, settings.wlroleid, CT.GlobalDescType.WLRoleId, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, settings.bluserid, CT.GlobalDescType.BLUserId, name, undefined),
   buttonParsers.global(language, settings.wluserid, CT.GlobalDescType.WLUserId, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [buttonParsers.back(name, undefined)],
 },
];
