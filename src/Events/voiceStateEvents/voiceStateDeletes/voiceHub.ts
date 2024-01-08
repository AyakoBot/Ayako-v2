import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

export default async (state: Discord.VoiceState) => {
 if (!state.channel) return;
 if (state.channel.members.size) return;

 const vc = await state.client.util.DataBase.voicechannels.update({
  where: {
   guildid_channelid: { guildid: state.guild.id, channelid: state.channel.id },
  },
  data: {
   everyonelefttime: Date.now(),
  },
  select: { hubid: true },
 });
 if (!vc) return;

 const settings = await state.client.util.DataBase.voicehubs.findFirst({
  where: { channelid: vc.hubid },
 });
 if (!settings) {
  state.client.util.DataBase.voicechannels
   .delete({
    where: { guildid_channelid: { guildid: state.guild.id, channelid: state.channel.id } },
   })
   .then();
  return;
 }
 state.client.util.cache.vcDeleteTimeout.delete(state.guild.id, state.channel.id);

 state.client.util.cache.vcDeleteTimeout.set(
  Jobs.scheduleJob(new Date(Date.now() + Number(settings.deletetime) * 1000), () =>
   del(state.channel as Discord.VoiceBasedChannel),
  ),
  state.guild.id,
  state.channel.id,
 );
};

export const del = (channel: Discord.VoiceBasedChannel) => {
 if (channel.members.size) return;

 channel.client.util.DataBase.voicechannels
  .delete({
   where: { guildid_channelid: { guildid: channel.guild.id, channelid: channel.id } },
  })
  .then();
 channel.client.util.request.channels.delete(channel);
};
