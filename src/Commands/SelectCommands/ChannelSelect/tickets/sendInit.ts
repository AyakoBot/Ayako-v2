import {
 ButtonStyle,
 ComponentType,
 type ChannelSelectMenuInteraction,
 type GuildTextBasedChannel,
} from 'discord.js';
import { SettingNames } from '../../../../Typings/Settings.js';

export default async (cmd: ChannelSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.pop() as string;
 if (!id) return;

 const setting = await cmd.client.util.DataBase.ticketing.findUnique({
  where: { uniquetimestamp: id },
 });
 if (!setting) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const channel = cmd.channels.first() as GuildTextBasedChannel | undefined;
 if (!channel) return;

 const msg = await cmd.client.util.send(channel, {
  embeds: [
   {
    author: {
     name: language.autotypes.ticketing,
     icon_url: await cmd.client.util
      .getBotMemberFromGuild(cmd.guild)
      .then((m) => m.displayAvatarURL()),
    },
    description: language.ticketing.initDesc,
   },
  ],
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      custom_id: `tickets/create_${id}`,
      label: language.ticketing.startTicket,
      style: ButtonStyle.Primary,
     },
    ],
   },
  ],
 });

 if (!msg || 'message' in msg) {
  cmd.client.util.errorCmd(cmd, language.errors.sendMessage, language);
  return;
 }

 cmd.update({
  embeds: [
   {
    description: `${language.ticketing.initDone}\n\n${
     language.t.MessageURL
    }: ${cmd.client.util.util.makeCodeBlock(msg.url)}`,
    fields: [
     {
      name: language.ticketing.editTitle,
      value: language.ticketing.editSteps,
     },
    ],
   },
  ],
  components: [
   {
    type: ComponentType.ActionRow,
    components: [cmd.client.util.settingsHelpers.buttonParsers.back(SettingNames.Ticketing, id)],
   },
  ],
 });
};
