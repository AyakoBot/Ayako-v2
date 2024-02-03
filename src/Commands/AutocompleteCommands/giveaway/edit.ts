import type * as CT from '../../../Typings/Typings.js';

export default async (cmd: Parameters<CT.AutoCompleteFile['default']>[0]) =>
 cmd.client.util.importCache.Commands.AutocompleteCommands.giveaway.cancel.file.default(cmd);
