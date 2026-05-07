import * as Discord from 'discord.js';
import { MessageFlags } from 'discord.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 if (!cmd.isMessageContextMenuCommand()) return;
 if (cmd.commandName !== 'Report to Angel') return;

 const c = cmd.client.channels.cache.get('793438015284183110') as Discord.TextChannel;

 const member = await cmd.client.guilds.cache.get('672546390915940405')?.members.fetch(cmd.user.id);
 if (!member) {
  cmd.reply({
   content: 'You are not a member of angel.',
   flags: MessageFlags.Ephemeral,
  });
  return;
 }

 const targetMember = await cmd.client.guilds.cache
  .get('672546390915940405')
  ?.members.fetch(cmd.targetMessage.author.id)
  .catch(() => null);

 c.send({
  embeds: [
   {
    author: { name: 'New Report' },
    description: `Real Content: \`\`\`${cmd.targetMessage.content}\`\`\``,
    fields: [
     {
      name: 'Reporter',
      value: `<@${cmd.user.id}> / ${cmd.user.username} / (\`${cmd.user.id}\`)`,
      inline: true,
     },
     {
      name: 'Reported joined',
      value: targetMember ? `<t:${Math.floor((targetMember.joinedTimestamp || 0) / 1000)}:R>` : 'Not a member',
      inline: true,
     },
     {
      name: 'Reporter account created',
      value: `<t:${Math.floor(cmd.user.createdAt.getTime() / 1000)}:R>`,
      inline: true,
     },

     {
      name: 'Reported Message Author',
      value: `<@${cmd.targetMessage.author.id}> / ${cmd.targetMessage.author.username} / (\`${cmd.targetMessage.author.id}\`)`,
      inline: true,
     },
     {
      name: 'Message Link',
      value: `[Jump to Message](${cmd.targetMessage.url})`,
      inline: true,
     },
     {
      name: 'Reported Message Author account created',
      value: `<t:${Math.floor(cmd.targetMessage.author.createdAt.getTime() / 1000)}:R>`,
      inline: true,
     },
    ],
   },
  ],
 });

 cmd.reply({
  content: 'Your report has been sent to the staff team.',
  flags: MessageFlags.Ephemeral,
 });
};
