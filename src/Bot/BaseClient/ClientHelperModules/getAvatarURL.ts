import type DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default (user: DDeno.User) =>
  client.helpers.getAvatarURL(user.id, user.discriminator, { avatar: user.avatar, size: 4096 });
