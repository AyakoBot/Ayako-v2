import * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

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

 const clientMember = await msg.client.util.getBotMemberFromGuild(msg.guild);
 const neededPerms = new Discord.PermissionsBitField(
  msg.client.util.bitUniques(
   bits,
   me
    ? BigInt(clientMember?.permissions.bitfield || 0)
    : BigInt(msg.member?.permissions.bitfield || 0),
  )[0],
 );

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
   icon_url: msg.client.util.constants.standard.error,
   url: msg.client.util.constants.standard.invite,
  },
  color: msg.client.util.CT.Colors.Danger,
  description: me ? language.permissions.error.msg : language.permissions.error.you,
  fields: [
   {
    name: msg.client.util.util.makeBold(language.permissions.error.needed),
    value: `\u200b${
     neededPerms.has(8n)
      ? `${msg.client.util.util.makeInlineCode(language.permissions.perms.Administrator)}`
      : Object.entries(neededPerms).map(
         ([name]) =>
          `${msg.client.util.util.makeInlineCode(
           language.permissions.perms[name as keyof typeof language.permissions.perms],
          )}`,
        )
    }`,
    inline: false,
   },
  ],
 };

 msg.client.util.replyMsg(msg, { embeds: [embed] });
};
