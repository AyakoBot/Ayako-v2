import type DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default (user: DDeno.User, member?: DDeno.Member) =>
  client.helpers.getAvatarURL(user.id, user.discriminator, {
    avatar: member ? member.avatar : user.avatar,
    size: 4096,
  });
