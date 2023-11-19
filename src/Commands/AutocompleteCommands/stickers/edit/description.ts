import sticker from '../delete.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 return sticker(cmd);
};

export default f;
