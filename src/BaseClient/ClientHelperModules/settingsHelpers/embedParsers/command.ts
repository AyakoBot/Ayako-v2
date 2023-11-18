import * as CT from '../../../../Typings/CustomTypings.js';
import client from '../../../Client.js';

/**
 * Parser for command type settings.
 * @param val - The command ID or name to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the command.
 */
export default (val: string | null, language: CT.Language) => {
 if (!val) return language.t.None;

 const isID = val?.replace(/\D+/g, '').length === val?.length;
 const cmd = isID ? client.application?.commands.cache.get(val) : undefined;
 if (cmd) return `</${cmd.name}:${cmd.id}>`;
 return `\`${val}\``;
};
