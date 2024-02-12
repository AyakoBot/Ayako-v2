import * as Discord from 'discord.js';

const threadPerms = new Discord.PermissionsBitField([
 Discord.PermissionFlagsBits.CreatePrivateThreads,
 Discord.PermissionFlagsBits.SendMessagesInThreads,
]);

export default async (guild: Discord.Guild) => {
 const channel = getChannel(guild);
 if (!channel) return;
};

const getChannel = (guild: Discord.Guild) => {
 const getAnyThreadableChannel = () =>
  guild.channels.cache.find((c) => guild.members.me?.permissionsIn(c).has(threadPerms));

 const getAnySendableChannel = () =>
  guild.channels.cache.find(
   (c) => guild.members.me?.permissionsIn(c).has(Discord.PermissionFlagsBits.SendMessages),
  );

 const threadableChannel = { thread: true, channel: getAnyThreadableChannel() };
 const sendableChannel = { thread: false, channel: getAnySendableChannel() };

 if (!guild.members.me) {
  return threadableChannel.channel ? threadableChannel.channel : sendableChannel.channel;
 }

 if (!guild.rulesChannel || !guild.rulesChannel.permissionsFor(guild.members.me).has(threadPerms)) {
  return threadableChannel.channel ? threadableChannel.channel : sendableChannel.channel;
 }

 return guild.rulesChannel;
};
