import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { checkCommandPermissions } from '../../../Events/BotEvents/messageEvents/messageCreate/commandHandler.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', false);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 if (await isBlocked(cmd, user, cmd.options.getMember('user'), CT.ModTypes.BanAdd, language)) {
  return;
 }

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
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.Message<true>,
 user: Discord.User,
 member: Discord.GuildMember | null,
 type: CT.ModTypes,
 language: CT.Language,
) => {
 const unblocked = cmd.client.util.cache.unblockedModUsers.has(
  { ...cmd, authorId: ('user' in cmd ? cmd.user : cmd.author).id },
  type,
  user.id,
 );

 const can = async () => {
  const canRun = (name: string) =>
   checkCommandPermissions(
    {
     guildId: cmd.guildId,
     author: user,
     member,
     channelId: cmd.channelId,
     guild: cmd.guild,
    },
    name,
   );

  const canMod = (await canRun('mod')).can;

  switch (type) {
   case CT.ModTypes.BanAdd: {
    const canCmd = await canRun('ban');
    return canMod && canCmd.can && canCmd.debugNum !== 1;
   }
   case CT.ModTypes.KickAdd: {
    const canCmd = await canRun('kick');
    return canMod && canCmd.can && canCmd.debugNum !== 1;
   }
   case CT.ModTypes.SoftBanAdd: {
    const canCmd = await canRun('soft-ban');
    return canMod && canCmd.can && canCmd.debugNum !== 1;
   }
   case CT.ModTypes.StrikeAdd: {
    const canCmd = await canRun('strike');
    return canMod && canCmd.can && canCmd.debugNum !== 1;
   }
   case CT.ModTypes.TempBanAdd: {
    const canCmd = await canRun('temp-ban');
    return canMod && canCmd.can && canCmd.debugNum !== 1;
   }

   default:
    return canMod;
  }
 };

 if (!unblocked && (await can())) {
  const payload = {
   embeds: [
    {
     author: {
      name: language.mod.warning.author,
      icon_url: cmd.client.util.emotes.warning.link,
     },
     color: CT.Colors.Danger,
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
  };

  if ('user' in cmd) cmd.client.util.replyCmd(cmd, payload);
  else cmd.client.util.replyMsg(cmd, payload);

  cmd.client.util.cache.unblockedModUsers.set(
   { ...cmd, authorId: ('user' in cmd ? cmd.user : cmd.author).id },
   type,
   user.id,
  );
  return true;
 }

 cmd.client.util.cache.unblockedModUsers.delete(
  { ...cmd, authorId: ('user' in cmd ? cmd.user : cmd.author).id },
  type,
  user.id,
 );
 return false;
};
