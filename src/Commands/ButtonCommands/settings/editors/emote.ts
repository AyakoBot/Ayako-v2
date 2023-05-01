import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.TableNamesMap;
 if (!settingName) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;
 type SettingsType = CT.TableNamesMap[typeof tableName];

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = (await ch.settingsHelpers.changeHelpers.get(
  tableName,
  fieldName,
  cmd.guildId,
  uniquetimestamp,
 )) as SettingsType;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];
 if (!cmd.inGuild()) return;

 const channel = await cmd.channel?.fetch().catch(() => undefined);
 if (!channel) return;
 if (!channel.isTextBased()) return;
 if (!('threads' in channel) || channel.type === Discord.ChannelType.GuildAnnouncement) {
  cmd.update({
   embeds: [
    {
     author: {
      name: language.error,
      icon_url: ch.objectEmotes.warning.link,
     },
     color: ch.constants.colors.danger,
     description: language.errors.noThreadCanBeCreated,
    },
   ],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [ch.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp))],
    },
   ],
  });

  return;
 }

 const thread = (await channel.threads.create({
  name: language.slashCommands.settings.reactionEditor.name,
  invitable: false,
  type: Discord.ChannelType.PrivateThread,
 })) as Discord.PrivateThreadChannel;

 thread.send({
  content: `${cmd.user}`,
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    lan,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    'emote',
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: 'deleteThread',
      emoji: ch.objectEmotes.trash,
      label: language.Delete,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Success,
      custom_id: `settings/done/emote_${settingName}_${fieldName}_${uniquetimestamp}`,
      label: language.Detect,
     },
    ],
   },
  ],
  allowedMentions: { users: [cmd.user.id] },
 });

 if (!thread) return;

 cmd.update({
  embeds: [
   {
    description: language.slashCommands.settings.reactionEditor.desc(thread),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [ch.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp))],
   },
  ],
 });
};
