import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { checkCommandPermissions } from 'src/Events/BotEvents/messageEvents/messageCreate/commandHandler.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', false);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 if (await isBlocked(cmd, user, CT.ModTypes.BanAdd, language)) return;

 const modOptions = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: duration ? cmd.client.util.getDuration(duration) : undefined,
  deleteMessageSeconds: deleteMessageDuration
   ? cmd.client.util.getDuration(deleteMessageDuration, 604800) / 1000
   : 604800,
  skipChecks: false,
 };

 if (!duration) delete modOptions.duration;

 cmd.client.util.mod(
  cmd,
  duration ? CT.ModTypes.TempBanAdd : CT.ModTypes.BanAdd,
  modOptions as CT.ModOptions<
   typeof duration extends string ? CT.ModTypes.TempBanAdd : CT.ModTypes.BanAdd
  >,
 );
};

export const isBlocked = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 user: Discord.User,
 type: CT.ModTypes,
 language: CT.Language,
) => {
 const unblocked = cmd.client.util.cache.unblockedModUsers.has(
  { ...cmd, authorId: cmd.user.id },
  type,
  user.id,
 );

 if (
  !unblocked &&
  (
   await checkCommandPermissions(
    {
     guildId: cmd.guildId,
     author: user,
     member: cmd.options.getMember('user'),
     channelId: cmd.channelId,
     guild: cmd.guild,
    },
    'ban',
   )
  ).can
 ) {
  cmd.client.util.replyCmd(cmd, {
   embeds: [
    {
     author: {
      name: language.mod.warning.author,
      icon_url: cmd.client.util.emotes.warning.link,
     },
     description: language.mod.warning.desc,
     fields: [
      {
       name: language.mod.warning.commandUnblocked,
       value: language.mod.warning.commandUnblockedDesc,
      },
      {
       name: language.t.User,
       value: language.languageFunction.getUser(user),
      },
     ],
    },
   ],
  });

  cmd.client.util.cache.unblockedModUsers.set({ ...cmd, authorId: cmd.user.id }, type, user.id);
  return true;
 }

 cmd.client.util.cache.unblockedModUsers.delete({ ...cmd, authorId: cmd.user.id }, type, user.id);
 return false;
};
