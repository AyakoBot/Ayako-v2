import * as Discord from 'discord.js';
import { getContent } from '../../Events/BotEvents/autoModerationActionEvents/censor.js';
import * as CT from '../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.Message<true>,
 text?: string,
) => {
 if (cmd instanceof Discord.ChatInputCommandInteraction && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;
 if (!cmd.channel) return;

 if (cmd.guildId === '672546390915940405') console.log(1);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.afk;
 const author = cmd instanceof Discord.ChatInputCommandInteraction ? cmd.user : cmd.author;

 if (cmd.guildId === '672546390915940405') console.log(2);

 const afk = await cmd.client.util.DataBase.afk.findUnique({
  where: { userid_guildid: { userid: author.id, guildid: cmd.guildId } },
 });

 if (cmd.guildId === '672546390915940405') console.log(3);

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

 if (cmd.guildId === '672546390915940405') console.log(4);

 if (cmd instanceof Discord.ChatInputCommandInteraction && !afk) {
  await cmd.client.util.replyCmd(cmd, {
   embeds,
   ephemeral: false,
   content: afk ? lan.updated(author) : lan.set(author),
  });
 } else if (cmd instanceof Discord.ChatInputCommandInteraction) {
  await cmd.client.util.replyCmd(cmd, {
   embeds,
   ephemeral: false,
   content: afk ? lan.updated(author) : lan.set(author),
  });
 } else {
  await cmd.client.util.send(cmd.channel, {
   embeds,
   content: afk ? lan.updated(author) : lan.set(author),
  });

  if (await cmd.client.util.isDeleteable(cmd)) cmd.client.util.request.channels.deleteMessage(cmd);
 }

 if (cmd.guildId === '672546390915940405') console.log(5);

 if (
  cmd.member &&
  cmd.member.id !== cmd.guild.ownerId &&
  Number(cmd.member?.displayName.length) <= 26 &&
  !cmd.member?.displayName.endsWith(' [AFK]')
 ) {
  await cmd.client.util.request.guilds.editMember(
   cmd.member,
   { nick: `${cmd.member.displayName} [AFK]` },
   lan.setReason,
  );
 }

 if (cmd.guildId === '672546390915940405') console.log(6);

 cmd.client.util.DataBase.afk
  .upsert({
   where: { userid_guildid: { userid: author.id, guildid: cmd.guildId } },
   create: {
    userid: author.id,
    guildid: cmd.guildId,
    text,
    since: Date.now(),
   },
   update: { text, since: Date.now() },
  })
  .then();
};
