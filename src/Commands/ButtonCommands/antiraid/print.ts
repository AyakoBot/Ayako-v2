import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'last5mins' | 'caughtUsers';
 const page = Number(args.shift()) || 0;

 const language = await cmd.client.util.getLanguage(cmd.guild.id);
 const file = cmd.message.attachments.find(
  (a) => a.name === (type === 'last5mins' ? 'last_5_mins_users.txt' : 'caught_users.txt'),
 );
 if (!file) {
  cmd.client.util.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const text = await cmd.client.util.txtFileLinkToString(file.url);
 if (!text) {
  cmd.client.util.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const textChunks = cmd.client.util.getStringChunks(
  cmd.client.util.getChunks(text.split(/\r?\n/), 3).map((a) => a.join('\n')),
  4000,
 );
 const thisChunk = textChunks[page];
 if (!thisChunk) return;

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    description: thisChunk.join('\n'),
    color: CT.Colors.Ephemeral,
   },
  ],
  files: [
   {
    name: type === 'last5mins' ? 'last_5_mins_users.txt' : 'caught_users.txt',
    attachment: Buffer.from(text),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      emoji: cmd.client.util.emotes.back,
      custom_id: `antiraid/print_${type}_${page - 1}`,
      disabled: page === 0,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      label: `${page + 1}/${textChunks.length}`,
      custom_id: '-',
      disabled: true,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      emoji: cmd.client.util.emotes.forth,
      custom_id: `antiraid/print_${type}_${page + 1}`,
      disabled: page === textChunks.length - 1,
     },
    ],
   },
  ],
 });
};
