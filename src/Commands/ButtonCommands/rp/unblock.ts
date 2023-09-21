import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 let user: Discord.User | undefined;

 if (cmd instanceof Discord.ButtonInteraction) {
  const userId = new URL(cmd.message.embeds[0].url || 'https://ayakobot.com').searchParams.get(
   'user',
  );
  user = userId ? await ch.getUser(userId) : undefined;
  if (!userId || !user) {
   ch.errorCmd(cmd, language.errors.userNotExist, language);
   return;
  }
 } else {
  user = cmd.options.getUser('user', true);
 }

 const unblocked = await ch.DataBase.blockedusers.delete({
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

 ch.replyCmd(cmd, payload);
};
