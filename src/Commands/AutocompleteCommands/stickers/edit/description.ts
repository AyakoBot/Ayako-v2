import * as CT from '../../../../Typings/Typings.js';
import sticker from '../delete.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 return sticker(cmd);
};

export default f;
