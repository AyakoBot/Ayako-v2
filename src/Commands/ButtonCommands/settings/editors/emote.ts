import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await ch.getLanguage(cmd.guildId);

 const channel = await cmd.channel?.fetch().catch(() => undefined);
 if (!channel) return;
 if (!channel.isTextBased()) return;
 if (!('threads' in channel) || channel.type === Discord.ChannelType.GuildAnnouncement) {
  cmd.update({
   embeds: [
    {
     author: {
      name: language.error,
      icon_url: ch.emotes.warning.link,
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
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    'emote',
    cmd.guild,
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
      emoji: ch.emotes.trash,
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
