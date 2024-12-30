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
    name: lan.fields.xppermsg.name,
    value: embedParsers.number(settings.xppermsg, language),
    inline: true,
   },
   {
    name: lan.fields.ignoreprefixes.name,
    value: embedParsers.boolean(settings.ignoreprefixes, language),
    inline: true,
   },
   {
    name: lan.fields.prefixes.name,
    value: settings.prefixes?.length
     ? settings.prefixes.map((p) => `\`${p}\``).join(', ')
     : language.t.None,
    inline: true,
   },
   {
    name: lan.fields.minwords.name,
    value: embedParsers.number(settings.minwords, language),
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
   buttonParsers.specific(language, settings.xppermsg, 'xppermsg', name, undefined),
   buttonParsers.boolean(language, settings.ignoreprefixes, 'ignoreprefixes', name, undefined),
   buttonParsers.specific(language, settings.prefixes, 'prefixes', name, undefined),
   buttonParsers.specific(language, settings.minwords, 'minwords', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [buttonParsers.back(name, undefined)],
 },
];
