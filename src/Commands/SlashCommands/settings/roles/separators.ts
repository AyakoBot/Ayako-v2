import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Separators;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories[name];

 const id = cmd.options.get('id', false)?.value as string;
 if (id) {
  showId(cmd, id, language, lan);
  return;
 }
 showAll(cmd, language, lan, 0);
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
     client.util.settingsHelpers.getUniquetimestampFromId(id),
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
 page,
) => {
 const { multiRowHelpers } = client.util.settingsHelpers;

 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings?.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  value: `${lan.fields.separator.name}: ${s.separator ? `<@&${s.separator}>` : language.t.None} `,
 }));

 const embeds = multiRowHelpers.embeds(fields, language, lan, page);
 const components = multiRowHelpers.options(language, name);
 multiRowHelpers.noFields(embeds, language);
 multiRowHelpers.components(embeds, components, language, name, page);

 embeds[0].description = lan.oneTimeRunner.notice(
  (await cmd.client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0',
 );

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

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => {
 const embeds: Discord.APIEmbed[] = [
  {
   footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
   description: client.util.constants.tutorials[
    name as keyof typeof client.util.constants.tutorials
   ]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : undefined,
   author: embedParsers.author(language, lan),
   fields: [
    {
     name: language.slashCommands.settings.active,
     value: embedParsers.boolean(settings?.active, language),
     inline: false,
    },
    {
     name: lan.fields.separator.name,
     value: embedParsers.role(settings?.separator, language),
     inline: true,
    },
    {
     name: lan.fields.isvarying.name,
     value: embedParsers.boolean(settings?.isvarying, language),
     inline: true,
    },
   ],
  },
 ];

 if (settings?.isvarying) {
  embeds[0].fields?.push({
   name: lan.fields.stoprole.name,
   value: embedParsers.role(settings?.stoprole, language),
   inline: true,
  });
 } else {
  embeds[0].fields?.push({
   name: lan.fields.roles.name,
   value: embedParsers.roles(settings?.roles, language),
   inline: false,
  });
 }

 return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => {
 const components: Discord.APIActionRowComponent<Discord.APIComponentInMessageActionRow>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.back(name, undefined),
    buttonParsers.global(
     language,
     !!settings?.active,
     CT.GlobalDescType.Active,
     name,
     Number(settings?.uniquetimestamp),
    ),
    buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
   ],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.specific(
     language,
     settings?.separator,
     'separator',
     name,
     Number(settings?.uniquetimestamp),
     CT.EditorTypes.Role,
    ),
    buttonParsers.boolean(
     language,
     settings?.isvarying,
     'isvarying',
     name,
     Number(settings?.uniquetimestamp),
    ),
   ],
  },
 ];

 if (settings?.isvarying) {
  components[1].components.push(
   buttonParsers.specific(
    language,
    settings?.stoprole,
    'stoprole',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
  );
 } else {
  components[1].components.push(
   buttonParsers.specific(
    language,
    settings?.roles,
    'roles',
    name,
    Number(settings?.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
  );
 }

 return components;
};
