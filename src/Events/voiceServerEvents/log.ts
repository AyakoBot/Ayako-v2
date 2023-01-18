import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (payload: { token: string; endpoint?: string; guildId: bigint }) => {
  const channels = await client.ch.getLogChannels('voiceevents', payload);
  if (!channels) return;

  const language = await client.ch.languageSelector(payload.guild.id);
  const lan = language.events.logs.voiceState;
  const con = client.customConstants.events.logs.voiceState;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUpdateServer,
      icon_url: con.update,
    },
    color: client.customConstants.colors.success,
    description: lan.descUpdateServer(payload.endpoint ?? language.unknown),
  };

  client.ch.send(
    { id: channels, guildId: payload.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
