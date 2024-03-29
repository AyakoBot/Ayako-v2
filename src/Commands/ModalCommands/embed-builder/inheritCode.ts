import * as Discord from 'discord.js';
import startOver from '../../ButtonCommands/embed-builder/startOver.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (!cmd.isFromMessage()) return;

 const code = [
  cmd.fields.getTextInputValue('0'),
  cmd.fields.getTextInputValue('1'),
  cmd.fields.getTextInputValue('2'),
  cmd.fields.getTextInputValue('3'),
  cmd.fields.getTextInputValue('4'),
 ].join('');
 if (!code) return;

 try {
  new Discord.EmbedBuilder(JSON.parse(code) as Discord.APIEmbed);
 } catch (e) {
  const language = await cmd.client.util.getLanguage(cmd.guildId);
  cmd.client.util.errorCmd(cmd, e as Discord.DiscordjsError, language);
  return;
 }

 startOver(cmd, [], JSON.parse(code) as Discord.APIEmbed);
};
