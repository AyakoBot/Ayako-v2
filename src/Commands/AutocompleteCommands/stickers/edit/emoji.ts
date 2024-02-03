import type * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const focused = cmd.options.getFocused(true);
 switch (focused.name) {
  case 'emoji':
   return cmd.client.util.importCache.Commands.AutocompleteCommands.stickers.create[
    'from-message'
   ].file.default(cmd);
  case 'sticker':
   return cmd.client.util.importCache.Commands.AutocompleteCommands.stickers.delete.file.default(
    cmd,
   );
  default:
   return [];
 }
};

export default f;
