import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import { getContent } from '../../Events/autoModerationActionEvents/censor.js';
import * as CT from '../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.Message<true>,
 text?: string,
) => {
 if (cmd instanceof Discord.ChatInputCommandInteraction && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;
 if (!cmd.channel) return;

 const author = cmd instanceof Discord.ChatInputCommandInteraction ? cmd.user : cmd.author;
 const language = await ch.getLanguage(cmd.guildId);
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
      color: CT.Colors.Loading,
      description: await getContent(cmd.guild, text, undefined, undefined, cmd.channel),
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

  if (await ch.isDeleteable(cmd)) ch.request.channels.deleteMessage(cmd);
 }

 const me = await ch.getBotMemberFromGuild(cmd.guild);
 if (!me) {
  ch.error(cmd.guild, new Error("I can't find myself in this guild!"));
  return;
 }

 if (
  cmd.member &&
  Number(cmd.member?.displayName.length) <= 26 &&
  !cmd.member?.displayName.endsWith(' [AFK]')
 ) {
  await ch.request.guilds.editMember(
   cmd.member,
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
