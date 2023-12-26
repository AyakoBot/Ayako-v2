import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const member = cmd.options.getMember('user');
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.moderation.unafk;
 const reason = cmd.options.getString('reason', false) ?? language.t.noReasonProvided;
 const afk = await ch.DataBase.afk.delete({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: user.id },
  },
  select: { userid: true },
 });

 if (!afk?.userid) {
  ch.errorCmd(cmd, lan.notAfk(user), language);
  return;
 }

 updateNickname(reason, member);

 ch.replyCmd(cmd, { content: lan.unAfk(user) });
 ch.log(cmd.guild, CT.ModTypes.UnAfk, user, cmd.user, {
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

 ch.request.guilds.editMember(
  member,
  {
   nick: member.displayName.slice(0, member.displayName.length - 6),
  },
  reason,
 );
};
