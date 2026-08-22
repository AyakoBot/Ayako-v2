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
  const embedOrEmbeds = JSON.parse(code) as
   | Discord.APIEmbed
   | Discord.APIEmbed[]
   | Discord.APIMessage;

  new Discord.EmbedBuilder(extractEmbed(embedOrEmbeds));
 } catch (e) {
  const language = await cmd.client.util.getLanguage(cmd.guildId);

  cmd.client.util.errorCmd(
   cmd,
   (e as Discord.DiscordjsError)?.message ??
    language.slashCommands.embedbuilder.inherit.invalidJSON,
   language,
  );
  return;
 }

 startOver(
  cmd,
  [],
  extractEmbed(JSON.parse(code) as Discord.APIEmbed | Discord.APIEmbed[] | Discord.APIMessage),
 );
};

const extractEmbed = (
 m: Discord.APIEmbed | Discord.APIEmbed[] | Discord.APIMessage,
): Discord.APIEmbed => {
 if ('embeds' in m) {
  if (m.embeds.length === 0) return {};
  return m.embeds[0] as Discord.APIEmbed;
 }

 if (Array.isArray(m)) {
  if (m.length === 0) return {};
  return m[0];
 }

 return m;
};
