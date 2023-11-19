import { findBestMatch } from 'string-similarity';
import * as CT from '../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const stickerName = cmd.options.getString('sticker', true);

 return findBestMatch(
  stickerName,
  cmd.guild.stickers.cache.map((s) => s.name),
 )
  .ratings.sort((a, b) => b.rating - a.rating)
  .map((r) => ({
   name: r.target,
   value: cmd.guild.stickers.cache.find((s) => s.name === r.target)?.id ?? stickerName,
  }))
  .splice(0, 25);
};

export default f;
