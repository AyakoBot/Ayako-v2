import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.Message<true>,
 text?: string,
) => {
 if (cmd instanceof Discord.ChatInputCommandInteraction && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;
 if (!cmd.channel) return;

 const author = cmd instanceof Discord.ChatInputCommandInteraction ? cmd.user : cmd.author;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.afk;

 const afk = await ch.DataBase.afk.findUnique({
  where: { userid_guildid: { userid: author.id, guildid: cmd.guildId } },
 });

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  text = cmd.options.getString('reason', false) ?? undefined;
 }

 const embeds: Discord.APIEmbed[] = text
  ? [
     {
      color: ch.constants.colors.loading,
      description: text,
     },
    ]
  : [];

 if (cmd instanceof Discord.ChatInputCommandInteraction && !afk) {
  await ch.replyCmd(cmd, {
   embeds,
   ephemeral: false,
   content: afk ? lan.updated : lan.set(author),
  });
 } else if (cmd instanceof Discord.ChatInputCommandInteraction) {
  await ch.replyCmd(cmd, {
   embeds,
   ephemeral: true,
   content: afk ? lan.updated : lan.set(author),
  });
 } else {
  await ch.send(cmd.channel, {
   embeds,
   content: afk ? lan.updated : lan.set(author),
  });
  if (cmd.deletable) cmd.delete();
 }

 if (
  cmd.member?.manageable &&
  cmd.guild.members.me?.permissions.has(134217728n) &&
  Number(cmd.member?.displayName.length) <= 26 &&
  !cmd.member?.displayName.endsWith(' [AFK]')
 ) {
  await ch.request.guilds.editMember(
   cmd.guild,
   cmd.member.id,
   { nick: `${cmd.member.displayName} [AFK]` },
   lan.setReason,
  );
 }

 ch.DataBase.afk
  .upsert({
   where: { userid_guildid: { userid: author.id, guildid: cmd.guildId } },
   create: {
    userid: author.id,
    guildid: cmd.guildId,
    text,
    since: Date.now(),
   },
   update: {
    text,
    since: Date.now(),
   },
  })
  .then();
};
