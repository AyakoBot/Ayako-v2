import * as CT from '../../../../Typings/Typings.js';
import { emoji } from '../create/from-message.js';
import sticker from '../delete.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const focused = cmd.options.getFocused(true);
 switch (focused.name) {
  case 'emoji':
   return emoji(cmd);
  case 'sticker':
   return sticker(cmd);
  default:
   return [];
 }
};

export default f;
