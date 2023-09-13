import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (!cmd.isFromMessage()) return;

 const embed = cmd.message.embeds[0].data;
 const messageLink = cmd.fields.getTextInputValue('message');
 const [, , , , , channelId, messageId] = messageLink.split('/');

 const { guild } = cmd;
 if (!guild) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.slashCommands.embedbuilder.edit;

 const channel = await ch.getChannel.guildTextChannel(channelId);
 if (!channel) {
  noChannelFound(cmd, lan);
  return;
 }

 const message = await ch.request.channels.getMessage(channel, messageId);
 if ('message' in message) {
  noMessageFound(cmd, lan);
  return;
 }

 ch.request.channels.editMessage(guild, channel.id, message.id, { embeds: [embed] });

 cmd.reply({
  content: lan.edited,
  ephemeral: true,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Link,
      label: lan.view,
      url: ch.constants.standard.msgurl(guild.id, channel.id, message.id),
     },
    ],
   },
  ],
 });
};

const noMessageFound = (
 cmd: Discord.ModalSubmitInteraction,
 lan: CT.Language['slashCommands']['embedbuilder']['edit'],
) =>
 cmd.reply({
  content: lan.noMessageFound,
 });

const noChannelFound = (
 cmd: Discord.ModalSubmitInteraction,
 lan: CT.Language['slashCommands']['embedbuilder']['edit'],
) =>
 cmd.reply({
  content: lan.noMessageFound,
 });
