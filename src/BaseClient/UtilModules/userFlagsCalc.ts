import Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import Emotes from './emotes.js';
import constants from '../Other/constants.js';

/**
 * Calculates the user flags based on the given bits.
 * @param bits - The bits to calculate the user flags from.
 * @param lan - The language object containing the user flags translations.
 * @param emotes - Whether to include emotes in the user flags or not. Defaults to false.
 * @returns An array of user flags.
 */
export default (bits: number, lan: CT.Language, emotes = false) => {
 if (!bits) return [];
 const bitField = new Discord.PermissionsBitField(BigInt(bits));
 const flags = [];

 if (bitField.has(1n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.DiscordEmployee) : ''} ${
    lan.JSON.userFlags.DiscordEmployee
   }`,
  );
 }
 if (bitField.has(2n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.PartneredServerOwner) : ''} ${
    lan.JSON.userFlags.PartneredServerOwner
   }`,
  );
 }
 if (bitField.has(4n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.HypesquadEvents) : ''} ${
    lan.JSON.userFlags.HypesquadEvents
   }`,
  );
 }
 if (bitField.has(8n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.BugHunterLevel1) : ''} ${
    lan.JSON.userFlags.BugHunterLevel1
   }`,
  );
 }
 if (bitField.has(64n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.HouseBravery) : ''} ${
    lan.JSON.userFlags.HouseBravery
   }`,
  );
 }
 if (bitField.has(128n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.HouseBrilliance) : ''} ${
    lan.JSON.userFlags.HouseBrilliance
   }`,
  );
 }
 if (bitField.has(256n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.HouseBalance) : ''} ${
    lan.JSON.userFlags.HouseBalance
   }`,
  );
 }
 if (bitField.has(512n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.EarlySupporter) : ''} ${
    lan.JSON.userFlags.EarlySupporter
   }`,
  );
 }
 if (bitField.has(1024n)) {
  flags.push(`${lan.JSON.userFlags.TeamUser}`);
 }
 if (bitField.has(2048n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Bot) : ''} ${lan.JSON.userFlags.Bot}`,
  );
 }
 if (bitField.has(4096n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.Nitro) : ''} ${
    lan.JSON.userFlags.Nitro
   }`,
  );
 }
 if (bitField.has(16384n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.BugHunterLevel2) : ''} ${
    lan.JSON.userFlags.BugHunterLevel2
   }`,
  );
 }
 if (bitField.has(65536n)) {
  flags.push(
   `${
    emotes
     ? `${constants.standard.getEmote(
        Emotes.userFlags.VerifiedBot[0],
       )}${constants.standard.getEmote(Emotes.userFlags.VerifiedBot[1])}`
     : ''
   } ${lan.JSON.userFlags.VerifiedBot}`,
  );
 }
 if (bitField.has(131072n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.EarlyVerifiedBotDeveloper) : ''} ${
    lan.JSON.userFlags.VerifiedDeveloper
   }`,
  );
 }
 if (bitField.has(262144n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.DiscordCertifiedModerator) : ''} ${
    lan.JSON.userFlags.CertifiedModerator
   }`,
  );
 }
 if (bitField.has(524288n)) {
  flags.push(`${lan.JSON.userFlags.BotHTTPInteractions}`);
 }
 if (bitField.has(1048576n)) {
  flags.push(`${lan.JSON.userFlags.Spammer}`);
 }
 if (bitField.has(4194304n)) {
  flags.push(
   `${emotes ? constants.standard.getEmote(Emotes.userFlags.ActiveDeveloper) : ''} ${
    lan.JSON.userFlags.ActiveDeveloper
   }`,
  );
 }
 if (bitField.has(17592186044416n)) {
  flags.push(`${lan.JSON.userFlags.Quarantined}`);
 }

 return flags;
};
