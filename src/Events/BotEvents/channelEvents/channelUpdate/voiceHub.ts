import { GuildChannel, Message, StageChannel, VoiceChannel } from 'discord.js';
import { getVCSettings, getVHSettings } from '../../../../Commands/SlashCommands/vc/add/member.js';
import { getPayload } from '../../voiceStateEvents/voiceStateCreates/voiceHub.js';

export default async (channel: GuildChannel) => {
 if (!(channel instanceof StageChannel) && !(channel instanceof VoiceChannel)) return;
 if (!(await getVHSettings(channel.guild))) return;

 const vcSettings = await getVCSettings(channel.guild, channel.id);
 if (!vcSettings) return;

 const owner = await channel.client.util.getUser(vcSettings.ownerid);
 if (!owner) return;

 const bot = await channel.client.util.getBotIdFromGuild(channel.guild);
 const message = await getFromHistory(channel, bot);
 if (!message) return;

 const language = await channel.client.util.getLanguage(channel.guild.id);
 const payload = await getPayload(language, owner, channel);

 channel.client.util.request.channels.editMsg(message, payload);
};

const find = (m: Message<true>, self: string) =>
 m.author.id === self && m.embeds?.[0]?.url?.includes('isVoiceHub=true');

const getFromHistory = async (channel: VoiceChannel | StageChannel, self: string) => {
 const findInCache = () => channel.messages.cache.find((m) => find(m, self));

 const findInFetched = async () => {
  const messages = await channel.client.util.fetchMessages(channel, { amount: 500 });
  return messages.find((m) => find(m, self));
 };

 return findInCache() || findInFetched();
};
