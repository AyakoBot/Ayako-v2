import type { ChatInputCommandInteraction } from 'discord.js';

export default async (cmd: ChatInputCommandInteraction) => {
 const identId = cmd.inGuild() ? cmd.guildId : cmd.channelId;

 const snowball = await cmd.client.util.DataBase.event.findUnique({
  where: { identId_userId: { identId, userId: cmd.user.id }, has: true },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId ?? 'en-GB');
 const lan = language.slashCommands.event;

 if (!snowball) {
  cmd.reply({ content: lan.outOfAmmo, ephemeral: true });
  return;
 }

 const hits = !cmd.client.util.getRandom(0, 1);
 const stpObject = {
  user: cmd.options.getUser('user', true),
  cmdId: await cmd.client.util.getCustomCommand(cmd.guild, 'event').then((c) => c?.id || '0'),
 };

 if (hits) {
  cmd.reply({
   content: cmd.client.util.stp(
    lan.hits[cmd.client.util.getRandom(0, lan.hits.length - 1)],
    stpObject,
   ),
   ephemeral: false,
  });

  await cmd.client.util.DataBase.event.update({
   where: { identId_userId: { identId, userId: cmd.user.id } },
   data: { hits: { increment: 1 }, has: false },
  });
  return;
 }

 await cmd.client.util.DataBase.event.update({
  where: { identId_userId: { identId, userId: cmd.user.id } },
  data: { has: false },
 });

 cmd.reply({
  content: cmd.client.util.stp(
   lan.hits[cmd.client.util.getRandom(0, lan.misses.length - 1)],
   stpObject,
  ),
  ephemeral: false,
 });
};
