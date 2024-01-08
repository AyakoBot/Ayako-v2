import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const member = cmd.options.getMember('user');
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.moderation.unafk;
 const reason = cmd.options.getString('reason', false) ?? language.t.noReasonProvided;
 const afk = await cmd.client.util.DataBase.afk.delete({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: user.id },
  },
  select: { userid: true },
 });

 if (!afk?.userid) {
  cmd.client.util.errorCmd(cmd, lan.notAfk(user), language);
  return;
 }

 updateNickname(reason, member);

 cmd.client.util.replyCmd(cmd, { content: lan.unAfk(user) });
 cmd.client.util.log(cmd.guild, CT.ModTypes.UnAfk, user, cmd.user, {
  reason,
  dbOnly: false,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  skipChecks: false,
 });
};

const updateNickname = (reason: string, member: Discord.GuildMember | null) => {
 if (!member) return;
 if (!member.nickname?.endsWith(' [AFK]')) return;

 member.client.util.request.guilds.editMember(
  member,
  {
   nick: member.displayName.slice(0, member.displayName.length - 6),
  },
  reason,
 );
};
