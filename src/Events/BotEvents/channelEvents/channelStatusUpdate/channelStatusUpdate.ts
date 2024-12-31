import type { BaseGuildVoiceChannel } from 'discord.js';

import log from './log.js';

export default async (
 channel: BaseGuildVoiceChannel,
 oldStatus: string,
 newStatus: string,
 internal: boolean,
) => {
 if (!internal) throw new Error('ChannelStatusUpdate received from unknown source');

 log(channel, oldStatus, newStatus);
};
