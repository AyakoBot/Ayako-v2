import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'last5mins' | 'caughtUsers';
 const page = Number(args.shift()) || 0;

 const language = await ch.getLanguage(cmd.guild.id);
 const file = cmd.message.attachments.find(
  (a) => a.name === (type === 'last5mins' ? 'last_5_mins_users.txt' : 'caught_users.txt'),
 );
 if (!file) {
  ch.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const text = await ch.txtFileLinkToString(file.url);
 if (!text) {
  ch.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const textChunks = ch.getStringChunks(
  ch.getChunks(text.split(/\r?\n/), 3).map((a) => a.join('\n')),
  4000,
 );
 const thisChunk = textChunks[page];
 if (!thisChunk) return;

 ch.replyCmd(cmd, {
  embeds: [
   {
    description: thisChunk.join('\n'),
    color: ch.constants.colors.ephemeral,
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
      emoji: ch.emotes.back,
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
      emoji: ch.emotes.forth,
      custom_id: `antiraid/print_${type}_${page + 1}`,
      disabled: page === textChunks.length - 1,
     },
    ],
   },
  ],
 });
};
