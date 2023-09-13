import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as CT from '../../../Typings/CustomTypings.js';

import { request } from '../requestHandler.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../objectEmotes.js';
import stringEmotes from '../stringEmotes.js';
import send from '../send.js';
import cache from '../cache.js';
import deleteThread from './deleteThread.js';

export default async <T extends CT.ModTypes>(
 options: CT.ModOptions<T>,
 language: CT.Language,
 type: T,
) => {
 const { dm } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const embed = {
  color: ['roleAdd', 'roleRemove', 'banRemove', 'muteRemove', 'channelBanRemove'].includes(type)
   ? constants.colors.success
   : constants.colors.danger,
  description: `${dm(options as never)}${
   !['roleAdd', 'roleRemove'].includes(type) ? `\n${language.mod.appeal(options.guild.id)}` : ''
  }`,
  fields: [...(options.reason ? [{ name: language.reason, value: options.reason }] : [])],
  thumbnail: ['roleAdd', 'roleRemove', 'banRemove', 'muteRemove', 'channelBanRemove'].includes(type)
   ? undefined
   : {
      url: objectEmotes.warning.link,
     },
 };

 if (
  !options.guild.rulesChannel ||
  ['banAdd', 'tempBanAdd', 'softBanAdd', 'kickAdd', 'banRemove'].includes(type)
 ) {
  send(options.target, { embeds: [embed] });
  return;
 }

 const thread = await request.channels.createThread(options.guild.rulesChannel, {
  type: Discord.ChannelType.PrivateThread,
  invitable: false,
  name: stringEmotes.warning,
 });

 if ('message' in thread) return;

 await request.threads.addMember(options.guild, thread.id, options.target.id);
 await send(thread, {
  embeds: [embed],
  content: `<@${options.target.id}>`,
  allowed_mentions: {
   users: [options.target.id],
  },
 });
 await request.channels.edit(thread, { locked: true });

 cache.deleteThreads.set(
  Jobs.scheduleJob(new Date(Date.now() + (thread.autoArchiveDuration ?? 60) * 60 * 1000), () => {
   deleteThread(options.guild, thread.id);
  }),
  options.guild.id,
  thread.id,
 );
};
