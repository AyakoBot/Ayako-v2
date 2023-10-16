import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const member = cmd.options.getMember('user');
 const reason = cmd.options.getString('reason', false)
  ? `${cmd.user.displayName}`
  : `${cmd.user.displayName}: ${cmd.options.getString('reason', false)}`;
 const afk = await ch.DataBase.afk.delete({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: user.id },
  },
  select: { userid: true },
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.moderation.unafk;

 if (!afk?.userid) {
  ch.errorCmd(cmd, lan.notAfk(user), language);
  return;
 }

 updateNickname(reason, member);

 ch.replyCmd(cmd, { content: lan.unAfk(user) });
 ch.log(cmd.guild, 'unAfk', user, cmd.user, {
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
  member.guild,
  member.id,
  {
   nick: member.displayName.slice(0, member.displayName.length - 6),
  },
  reason,
 );
};
