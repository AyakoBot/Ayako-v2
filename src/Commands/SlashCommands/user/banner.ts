import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

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

 cmd.client.util.replyCmd(cmd, {
  embeds: [
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
  ],
 });
};

