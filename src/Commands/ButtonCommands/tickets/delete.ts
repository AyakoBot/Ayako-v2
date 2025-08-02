import type { ButtonInteraction, GuildTextBasedChannel } from 'discord.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.channel) return;

 const id = args.pop() as string;
 if (!id) return;

 const language = await cmd.client.util.getLanguage(cmd.locale);
 const transcript = await getTranscript(cmd.channel);

 const settings = await cmd.client.util.DataBase.ticketing.findUnique({
  where: { uniquetimestamp: id },
 });
 if (!settings) return;

 cmd.client.util.send(
  { id: settings.logChannelIds, guildId: cmd.guildId },
  {
   embeds: [
    {
     author: { name: language.ticketing.logs.authorDelete },
     description: language.ticketing.logs.descDelete(cmd.user, cmd.channel),
     color: cmd.client.util.Colors.Danger,
    },
   ],
   files: transcript.length ? [cmd.client.util.txtFileWriter(transcript)] : [],
  },
 );

 const res = await cmd.client.util.request.channels.delete(cmd.channel);
 if (res && 'message' in res) {
  cmd.client.util.errorCmd(cmd, language.ticketing.cantDelete, language);
  return;
 }
};

const getTranscript = async (channel: GuildTextBasedChannel) => {
 const messages = await channel.client.util.fetchMessages(channel, { amount: 1000 });

 return messages
  .map((m, i) => {
   if (m.author.bot) {
    return `${m.embeds[0]?.author?.name}: ${m.embeds[0]?.description}${i === 0 ? '\n' : ''}`;
   }
   return `${m.author.username}: ${m.content}`;
  })
  .reverse()
  .join('\n');
};
