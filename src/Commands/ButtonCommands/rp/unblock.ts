import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 let user: Discord.User | undefined;

 if (cmd instanceof Discord.ButtonInteraction) {
  const userId = new URL(cmd.message.embeds[0].url || 'https://ayakobot.com').searchParams.get(
   'user',
  );
  user = userId ? await cmd.client.util.getUser(userId) : undefined;
  if (!userId || !user) {
   cmd.client.util.errorCmd(cmd, language.errors.userNotExist, language);
   return;
  }
 } else {
  user = cmd.options.getUser('user', true);
 }

 const unblocked = await cmd.client.util.DataBase.blockedusers.delete({
  where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: user.id } },
  select: { userid: true },
 });

 const payload = {
  embeds: [],
  components: [],
  content: unblocked?.userid
   ? language.slashCommands.rp.unblocked(user)
   : language.slashCommands.rp.notBlocked(user),
 };

 if (cmd instanceof Discord.ButtonInteraction) {
  cmd.update(payload);
  return;
 }

 cmd.client.util.replyCmd(cmd, payload);
};
