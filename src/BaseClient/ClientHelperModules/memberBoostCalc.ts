import Discord from 'discord.js';
import Emotes from './emotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';

/**
 * Calculates the boost flags for a user based on the given bits.
 * @param bits The bits representing the user's boost flags.
 * @param lan The language object containing the localized boost flag names.
 * @param emotes Whether to include emotes in the output.
 * @returns An array of strings representing the user's boost flags.
 */
export default async (bits: number, lan: CT.Language, emotes = false) => {
 if (!bits) return [];
 const bitField = new Discord.PermissionsBitField(BigInt(bits));
 const flags = [];

 if (bitField.has(1n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost1) : ''} ${lan.userFlags.Boost1}`,
  );
 }
 if (bitField.has(2n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost2) : ''} ${lan.userFlags.Boost2}`,
  );
 }
 if (bitField.has(4n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost3) : ''} ${lan.userFlags.Boost3}`,
  );
 }
 if (bitField.has(8n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost6) : ''} ${lan.userFlags.Boost6}`,
  );
 }
 if (bitField.has(16n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost9) : ''} ${lan.userFlags.Boost9}`,
  );
 }
 if (bitField.has(32n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost12) : ''} ${
    lan.userFlags.Boost12
   }`,
  );
 }
 if (bitField.has(64n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost15) : ''} ${
    lan.userFlags.Boost15
   }`,
  );
 }
 if (bitField.has(128n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost18) : ''} ${
    lan.userFlags.Boost18
   }`,
  );
 }
 if (bitField.has(256n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Boost24) : ''} ${
    lan.userFlags.Boost24
   }`,
  );
 }

 return flags;
};
