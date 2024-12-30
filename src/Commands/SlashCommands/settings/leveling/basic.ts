import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
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
): Discord.APIEmbed[] => [
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
    value: embedParsers.boolean(settings.active, language),
    inline: false,
   },
   {
    name: lan.fields.xpmultiplier.name,
    value: embedParsers.number(settings.xpmultiplier ?? 1, language),
    inline: true,
   },
   {
    name: lan.fields.rolemode.name,
    value: settings.rolemode ? language.rolemodes.replace : language.rolemodes.stack,
    inline: true,
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
   buttonParsers.global(language, !!settings.active, CT.GlobalDescType.Active, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings.xpmultiplier, 'xpmultiplier', name, undefined),
   buttonParsers.specific(language, settings.rolemode, CT.EditorTypes.RoleMode, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: Object.entries(language.slashCommands.settings.categories.leveling.buttons).map(
   ([k, v]) => ({
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Primary,
    custom_id: `settings/leveling/${k}`,
    label: v,
    emoji: getEmote(k),
   }),
  ),
 },
];

const getEmote = (k: string) => {
 switch (k) {
  case 'level-up':
   return client.util.emotes.levelupemotes[0];
  case 'voice':
   return client.util.emotes.channelTypes[2];
  case 'text':
   return client.util.emotes.channelTypes[0];
  default:
   return client.util.emotes.settings;
 }
};
