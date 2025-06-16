import * as Discord from 'discord.js';
import { findBestMatch } from 'string-similarity';
import Emojis from '../../../../BaseClient/Other/Emojis.js';
import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const focused = cmd.options.getFocused(true);
 switch (focused.name) {
  case 'emoji':
   return emoji(cmd);
  case 'sticker-name':
   return stickerName(cmd);
  default:
   return [];
 }
};

export default f;

export const emoji = (cmd: Discord.AutocompleteInteraction) => {
 const value = cmd.options.get('emoji', true)?.value as string;
 const emojis = findBestMatch(value, Emojis)
  .ratings.sort((a, b) => b.rating - a.rating)
  .map((r) => r.target);

 if (!emojis) return [];

 return emojis
  .map((e) => ({
   name: e,
   value: e,
  }))
  .splice(0, 25);
};

const stickerName = async (cmd: Discord.AutocompleteInteraction) => {
 const messageLink = cmd.options.getString('link', true);
 if (!messageLink) return [];

 const message = await cmd.client.util.getMessage(messageLink);
 if (!message) return [];

 return message.stickers
  .map((s) => ({
   name: s.name,
   value: s.id,
  }))
  .splice(0, 25);
};
