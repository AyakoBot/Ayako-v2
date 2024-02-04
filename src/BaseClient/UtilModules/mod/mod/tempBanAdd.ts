import * as Jobs from 'node-schedule';
import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.TempBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const res = await options.guild.client.util.mod.mod.banAdd(options, language, message, cmd);
 if (!res) return res;

 options.guild.client.util.cache.bans.set(
  Jobs.scheduleJob(new Date(Date.now() + options.duration * 1000), async () => {
   options.guild.client.util.mod.default(
    undefined,
    options.guild.client.util.CT.ModTypes.BanRemove,
    {
     dbOnly: false,
     executor: (await options.guild.client.util.getBotMemberFromGuild(options.guild)).user,
     guild: options.guild,
     reason: language.mod.execution.muteRemove.reason,
     target: options.target,
     skipChecks: true,
    },
   );
  }),
  options.guild.id,
  options.target.id,
 );

 return res;
};
