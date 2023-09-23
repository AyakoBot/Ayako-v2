import * as Discord from 'discord.js';
import bitUniques from './bitUniques.js';
import reply from './replyMsg.js';
import * as util from './util.js';
import type CT from '../../Typings/CustomTypings.js';
import constants from '../Other/constants.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';

/**
 * Checks if the bot or user has the required permissions and sends an error message if not.
 * @param msg - The message object.
 * @param bits - The required permissions as a bitfield.
 * @param language - The language object.
 * @param me - Whether to check the bot's permissions instead of the user's.
 */
export default async (
 msg: Discord.Message,
 bits: bigint | number,
 language: CT.Language,
 me?: boolean,
) => {
 if (!msg) return;
 if (!msg.guild) return;
 if (typeof bits === 'number') bits = BigInt(bits);

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
   name: language.error,
   icon_url: constants.standard.error,
   url: constants.standard.invite,
  },
  color: constants.colors.danger,
  description: me ? language.permissions.error.msg : language.permissions.error.you,
  fields: [
   {
    name: util.makeBold(language.permissions.error.needed),
    value: `\u200b${
     neededPerms.has(8n)
      ? `${util.makeInlineCode(language.permissions.perms.Administrator)}`
      : Object.entries(neededPerms).map(
         ([name]) =>
          `${util.makeInlineCode(
           language.permissions.perms[name as keyof typeof language.permissions.perms],
          )}`,
        )
    }`,
    inline: false,
   },
  ],
 };

 reply(msg, { embeds: [embed] });
};
