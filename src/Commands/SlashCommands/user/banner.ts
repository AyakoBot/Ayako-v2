import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const rawUser = cmd.options.getUser('user', false) || cmd.user;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const user = await cmd.client.util.request.users
  .get(cmd.guild, rawUser.id, cmd.client)
  .then((u) =>
   !('message' in u) && !u.banner
    ? cmd.client.util.request.users.get(cmd.guild, rawUser.id, cmd.client, { force: true })
    : u,
  );

 if (!user || 'message' in user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotExist, language);
  return;
 }

 const member = cmd.options.getMember('user') || cmd.guild?.members.cache.get(user.id);

 cmd.client.util.replyCmd(cmd, {
  embeds: (
   [
    {
     author: {
      name: cmd.client.util.constants.standard.user(user),
     },
     image: user.banner
      ? {
         url: user.bannerURL({ size: 4096 }) as string,
        }
      : undefined,
     description: user.banner ? undefined : language.t.None,
     color: cmd.client.util.getColor(
      cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
     ),
    },
    member && member.banner && cmd.guildId
     ? {
        image: member.banner
         ? {
            url: cmd.client.util.constants.standard.guildBannerURL(
             cmd.guildId,
             user.id,
             member.banner,
            ),
           }
         : undefined,
        description: member.avatar ? undefined : language.t.None,
        color: cmd.client.util.getColor(
         cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
        ),
       }
     : undefined,
   ] as Discord.APIEmbed[]
  ).filter((r): r is Discord.APIEmbed => !!r),
 });
};
