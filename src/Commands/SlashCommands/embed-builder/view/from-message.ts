import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const link = cmd.options.get('message-link', true).value as string;
 const [, , , gId, cId, mId] = link.split(/\/+/g);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.view['from-message'];

 if (!gId || !cId || !mId) {
  cmd.client.util.errorCmd(cmd, lan.notALink, language);
  return;
 }

 const response = (
  await client.cluster?.broadcastEval(
   async (cl, { gId: guildId, cId: channelId, mId: messageId }) => {
    const guild = cl.guilds?.cache.get(guildId);
    if (!guild) return undefined;

    const channel = cl.channels?.cache.get(channelId) as Discord.GuildTextBasedChannel;
    if (!channel) return undefined;
    if (!('messages' in channel)) return undefined;

    const message = await cl.util.request.channels.getMessage(channel, messageId);
    if ('message' in message) return undefined;

    return message?.embeds.map((e) => e);
   },
   { context: { gId, cId, mId } },
  )
 )
  ?.flat()
  .filter((e): e is Discord.APIEmbed => !!e);

 if (!response) {
  cmd.client.util.errorCmd(cmd, lan.notALink, language);
  return;
 }

 const embedCode = JSON.stringify(response, null, 2);
 const attachment = cmd.client.util.txtFileWriter(embedCode);

 if (!attachment) return;

 cmd.client.util.replyCmd(cmd, {
  ephemeral: true,
  files: [attachment],
 });
};
