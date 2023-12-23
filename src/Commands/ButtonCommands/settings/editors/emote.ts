import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
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

 const channel = await ch.getChannel.guildTextChannel(cmd.channelId);
 if (!channel) return;

 if (!('threads' in channel) || channel.type === Discord.ChannelType.GuildAnnouncement) {
  cmd.update({
   embeds: [
    {
     author: {
      name: language.t.error,
      icon_url: ch.emotes.warning.link,
     },
     color: CT.Colors.Danger,
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

 const thread = await ch.request.channels.createThread(channel, {
  name: language.slashCommands.settings.reactionEditor.name,
  invitable: false,
  type: Discord.ChannelType.PrivateThread,
 });

 if ('message' in thread) {
  ch.errorCmd(cmd, thread.message, language);
  return;
 }

 ch.request.channels.sendMessage(
  thread.guild,
  thread.id,
  {
   content: `${cmd.user}`,
   embeds: [
    await ch.settingsHelpers.changeHelpers.changeEmbed(
     language,
     settingName,
     fieldName,
     currentSetting?.[fieldName as keyof typeof currentSetting],
     CT.EditorTypes.Emote,
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
       label: language.t.Delete,
      },
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Success,
       custom_id: `settings/done/emote_${settingName}_${fieldName}_${uniquetimestamp}`,
       label: language.t.Detect,
      },
     ],
    },
   ],
   allowed_mentions: { users: [cmd.user.id] },
  },
  thread.client,
 );

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
