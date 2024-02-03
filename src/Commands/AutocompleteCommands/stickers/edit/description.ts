import type * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 return cmd.client.util.importCache.Commands.AutocompleteCommands.stickers.delete.file.default(cmd);
};

export default f;
