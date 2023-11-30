import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as CT from '../../../Typings/CustomTypings.js';

import { request } from '../requestHandler.js';
import constants from '../../Other/constants.js';
import emotes from '../emotes.js';
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
  description: dm(options as never),
  fields: [...(options.reason ? [{ name: language.t.Reason, value: options.reason }] : [])],
  thumbnail: ['roleAdd', 'roleRemove', 'banRemove', 'muteRemove', 'channelBanRemove'].includes(type)
   ? undefined
   : {
      url: emotes.warning.link,
     },
 };

 const appeal: Discord.APIActionRowComponent<Discord.APIButtonComponent>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Link,
     label: language.mod.appeal,
     url: `https://ayakobot.com/appeals/${options.guild.id}`,
    },
   ],
  },
 ];

 if (
  !options.guild.rulesChannel ||
  ['banAdd', 'tempBanAdd', 'softBanAdd', 'kickAdd', 'banRemove'].includes(type) ||
  !options.guild.members.cache.has(options.target.id)
 ) {
  send(options.target, {
   embeds: [embed],
   components: appeal,
  });
  return;
 }

 const thread = await request.channels.createThread(options.guild.rulesChannel, {
  type: Discord.ChannelType.PrivateThread,
  invitable: false,
  name: constants.standard.getEmote(emotes.warning),
 });

 if ('message' in thread) return;

 await request.threads.addMember(options.guild, thread.id, options.target.id);
 await send(thread, {
  embeds: [embed],
  content: `<@${options.target.id}>`,
  components: appeal,
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
