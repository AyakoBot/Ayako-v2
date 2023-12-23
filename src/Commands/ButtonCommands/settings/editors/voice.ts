import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import channel from './channel.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 channel(cmd, args, CT.ChannelTypes.Voice);
