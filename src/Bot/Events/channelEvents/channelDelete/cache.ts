import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default (channel: DDeno.Channel) => {
  invites(channel);
  webhooks(channel);
  reactions(channel);
};

const reactions = (channel: DDeno.Channel) => {
  const guild = client.reactions.get(channel.guildId);
  if (!guild) return;

  guild.delete(channel.id);
};

const invites = (channel: DDeno.Channel) => {
  const guild = client.invites.get(channel.guildId);
  if (!guild) return;

  Array.from(guild, ([, i]) => i)
    .filter((i) => i.channelId === channel.id)
    .forEach((i) =>
      client.events.inviteDelete(client, {
        channelId: channel.id,
        guildId: channel.guildId,
        code: i.code,
      }),
    );
};

const webhooks = (channel: DDeno.Channel) => {
  const guild = client.webhooks.get(channel.guildId);
  if (!guild) return;

  Array.from(guild, ([, w]) => w)
    .filter((w) => w.channelId === channel.id)
    .forEach(() =>
      client.events.webhooksUpdate(client, {
        channelId: channel.id,
        guildId: channel.guildId,
      }),
    );
};
