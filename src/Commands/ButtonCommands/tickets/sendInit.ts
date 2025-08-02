import { ComponentType, type ButtonInteraction } from 'discord.js';
import { GuildTextChannelTypes } from '../../../Typings/Channel.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.pop() as string;
 if (!id) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.update({
  embeds: [],
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.ChannelSelect,
      customId: `tickets/sendInit_${id}`,
      placeholder: language.ticketing.pickChannel,
      minValues: 1,
      maxValues: 1,
      channelTypes: GuildTextChannelTypes,
     },
    ],
   },
  ],
 });
};
