import * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import bitUniques from './bitUniques.js';
import replyMsg from './replyMsg.js';
import replyCmd from './replyCmd.js';
import * as util from './util.js';
import constants from '../Other/constants.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';

/**
 * Checks if the bot or user has the required permissions and sends an error message if not.
 * @param msg - The message or command object.
 * @param bits - The required permissions as a bitfield.
 * @param language - The language object.
 * @param me - Whether to check the bot's permissions instead of the user's.
 */
export default async (
 msg:
  | Discord.Message
  | Discord.ButtonInteraction<'cached'>
  | Discord.ChatInputCommandInteraction<'cached'>,
 bits: bigint | number,
 me?: boolean,
 update: boolean = true,
) => {
 if (!msg) return;
 if (!msg.guild) return;
 if (typeof bits === 'number') bits = BigInt(bits);

 const language = await msg.client.util.getLanguage(msg.guild.id);

 const clientMember = await getBotMemberFromGuild(msg.guild);
 const neededPerms = new Discord.PermissionsBitField(
  bitUniques(
   bits,
   me
    ? BigInt(clientMember?.permissions.bitfield || 0)
    : BigInt(msg.member?.permissions.bitfield || 0),
  )[0],
 );

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
   icon_url: constants.standard.error,
   url: constants.standard.invite,
  },
  color: CT.Colors.Danger,
  description: me ? language.permissions.error.msg : language.permissions.error.you,
  fields: [
   {
    name: util.makeBold(language.permissions.error.needed),
    value: `\u200b${
     neededPerms.has(8n)
      ? `${util.makeInlineCode(language.permissions.perms.Administrator)}`
      : neededPerms
         .toArray()
         .map((name) =>
          Discord.inlineCode(
           language.permissions.perms[name as keyof typeof language.permissions.perms],
          ),
         )
    }`,
    inline: false,
   },
  ],
 };

 if (msg instanceof Discord.Message) {
  replyMsg(msg, { embeds: [embed] });
  return;
 }

 if (msg instanceof Discord.ButtonInteraction && msg.isRepliable() && update) {
  msg.update({ embeds: [embed] });
  return;
 }

 if (!msg.isRepliable()) return;
 replyCmd(msg, { embeds: [embed] });
};
