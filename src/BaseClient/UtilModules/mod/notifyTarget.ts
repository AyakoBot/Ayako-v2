import {
 ButtonStyle,
 ComponentType,
 type APIActionRowComponent,
 type APIButtonComponent,
 type APIEmbedField,
} from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

import emotes from '../emotes.js';

const greenTypeActions = [
 CT.ModTypes.RoleAdd,
 CT.ModTypes.RoleRemove,
 CT.ModTypes.BanRemove,
 CT.ModTypes.MuteRemove,
 CT.ModTypes.ChannelBanRemove,
 CT.ModTypes.VcDeafenRemove,
 CT.ModTypes.VcMuteRemove,
];

export default async <T extends CT.ModTypes>(
 options: CT.ModOptions<T>,
 language: CT.Language,
 type: T,
) => {
 if (options.dm && !('message' in options.dm)) return;

 const { dm } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const embed = {
  color: greenTypeActions.includes(type) ? CT.Colors.Success : CT.Colors.Danger,
  description: dm(options as never),
  fields: [...(options.reason ? [{ name: language.t.Reason, value: options.reason }] : [])],
  thumbnail: greenTypeActions.includes(type) ? undefined : { url: emotes.warning.link },
 };

 if (!greenTypeActions.includes(type)) {
  embed.fields.push({
   inline: false,
   name: language.t.Appeal,
   value: language.events.appeal.desc(
    await options.guild.client.util
     .getCustomCommand(options.guild, 'appeal')
     .then((r) => r?.id || '0'),
   ),
  } as APIEmbedField);
 }

 const appeal: APIActionRowComponent<APIButtonComponent>[] = [
  {
   type: ComponentType.ActionRow,
   components: [
    {
     type: ComponentType.Button,
     style: ButtonStyle.Link,
     label: language.mod.appeal,
     url: `https://ayakobot.com/guilds/${options.guild.id}/appeals`,
    },
   ],
  },
 ];

 if (
  (!options.guild.rulesChannel || !options.guild.members.cache.has(options.target.id)) &&
  !options.dm
 ) {
  const dm = await options.guild.client.util.request.users.createDM(
   options.guild,
   options.target.id,
   options.guild.client,
  );
  if ('message' in dm) return;

  options.dm = await options.guild.client.util.request.channels.sendMessage(
   options.guild,
   dm.id,
   { embeds: [embed], components: greenTypeActions.includes(type) ? [] : appeal },
   options.guild.client,
  );
  return;
 }

 if (CT.DestructiveModTypes.includes(type)) return;

 const member = options.guild.members.cache.get(options.target.id);
 if (!member) return;

 options.guild.client.util.notificationThread(member, {
  embeds: [embed],
  components: greenTypeActions.includes(type) ? [] : appeal,
 });
};
