import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

import emotes from '../emotes.js';
import send from '../send.js';

export default async <T extends CT.ModTypes>(
 options: CT.ModOptions<T>,
 language: CT.Language,
 type: T,
) => {
 const { dm } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const embed = {
  color: ['roleAdd', 'roleRemove', 'banRemove', 'muteRemove', 'channelBanRemove'].includes(type)
   ? CT.Colors.Success
   : CT.Colors.Danger,
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
     url: `https://ayakobot.com/guilds/${options.guild.id}/appeals`,
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

 const member = options.guild.members.cache.get(options.target.id);
 if (!member) return;

 options.guild.client.util.notificationThread(member, { embeds: [embed], components: appeal });
};
