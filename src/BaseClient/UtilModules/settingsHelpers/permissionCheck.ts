import * as Discord from 'discord.js';
// import * as Typings from '../../../Typings/Typings.js';

// TODO: finish this
export default (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 // language: Typings.Language,
 permissions: bigint[],
): boolean => {
 if (!cmd.memberPermissions.has(permissions)) return false;
 return true;
};
