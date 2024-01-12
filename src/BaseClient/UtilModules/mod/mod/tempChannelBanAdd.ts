import * as Jobs from 'node-schedule';
import * as CT from '../../../../Typings/Typings.js';

import cache from '../../cache.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';

import channelBanAdd from './channelBanAdd.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.TempChannelBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const res = await channelBanAdd(options, language, message, cmd);
 if (!res) return res;

 cache.channelBans.set(
  Jobs.scheduleJob(new Date(Date.now() + options.duration * 1000), async () => {
   options.guild.client.util.files['/BaseClient/UtilModules/mod.js'](
    undefined,
    CT.ModTypes.ChannelBanRemove,
    {
     dbOnly: false,
     executor: (await getBotMemberFromGuild(options.guild)).user,
     guild: options.guild,
     reason: language.mod.execution.muteRemove.reason,
     target: options.target,
     channel: options.channel,
     skipChecks: true,
    },
   );
  }),
  options.guild.id,
  options.channel.id,
  options.target.id,
 );

 return res;
};
