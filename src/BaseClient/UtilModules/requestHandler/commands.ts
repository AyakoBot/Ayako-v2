import importCache from '../importCache/BaseClient/UtilModules/requestHandler/commands.js';

interface Commands {
 getGlobalCommands: typeof importCache.getGlobalCommands.file.default;
 createGlobalCommand: typeof importCache.createGlobalCommand.file.default;
 getGlobalCommand: typeof importCache.getGlobalCommand.file.default;
 editGlobalCommand: typeof importCache.editGlobalCommand.file.default;
 deleteGlobalCommand: typeof importCache.deleteGlobalCommand.file.default;
 bulkOverwriteGlobalCommands: typeof importCache.bulkOverwriteGlobalCommands.file.default;
 getGuildCommands: typeof importCache.getGuildCommands.file.default;
 createGuildCommand: typeof importCache.createGuildCommand.file.default;
 getGuildCommand: typeof importCache.getGuildCommand.file.default;
 editGuildCommand: typeof importCache.editGuildCommand.file.default;
 deleteGuildCommand: typeof importCache.deleteGuildCommand.file.default;
 bulkOverwriteGuildCommands: typeof importCache.bulkOverwriteGuildCommands.file.default;
 getGuildCommandPermissions: typeof importCache.getGuildCommandPermissions.file.default;
 getGuildCommandsPermissions: typeof importCache.getGuildCommandsPermissions.file.default;
 editGuildCommandPermissions: typeof importCache.editGuildCommandPermissions.file.default;
}

/**
 * Object containing methods for interacting with global and guild commands.
 * @property {Function} getGlobalCommands
 * - Method to get all global commands.
 * @property {Function} createGlobalCommand
 * - Method to create a new global command.
 * @property {Function} getGlobalCommand
 * - Method to get a specific global command by ID.
 * @property {Function} editGlobalCommand
 * - Method to edit a specific global command by ID.
 * @property {Function} deleteGlobalCommand
 * - Method to delete a specific global command by ID.
 * @property {Function} bulkOverwriteGlobalCommands
 * - Method to bulk overwrite all global commands.
 * @property {Function} getGuildCommands
 * - Method to get all guild commands for a specific guild.
 * @property {Function} createGuildCommand
 * - Method to create a new guild command for a specific guild.
 * @property {Function} getGuildCommand
 * - Method to get a specific guild command by ID for a specific guild.
 * @property {Function} editGuildCommand
 * - Method to edit a specific guild command by ID for a specific guild.
 * @property {Function} deleteGuildCommand
 * - Method to delete a specific guild command by ID for a specific guild.
 * @property {Function} bulkOverwriteGuildCommands
 * - Method to bulk overwrite all guild commands for a specific guild.
 * @property {Function} getGuildCommandPermissions
 * - Method to get the permissions for a specific guild command by ID for a specific guild.
 * @property {Function} getGuildCommandsPermissions
 * - Method to get the permissions for all guild commands for a specific guild.
 * @property {Function} editGuildCommandPermissions
 * - Method to edit the permissions for a specific guild command by ID for a specific guild.
 */
const commands: Commands = {
 getGlobalCommands: importCache.getGlobalCommands.file.default,
 createGlobalCommand: importCache.createGlobalCommand.file.default,
 getGlobalCommand: importCache.getGlobalCommand.file.default,
 editGlobalCommand: importCache.editGlobalCommand.file.default,
 deleteGlobalCommand: importCache.deleteGlobalCommand.file.default,
 bulkOverwriteGlobalCommands: importCache.bulkOverwriteGlobalCommands.file.default,
 getGuildCommands: importCache.getGuildCommands.file.default,
 createGuildCommand: importCache.createGuildCommand.file.default,
 getGuildCommand: importCache.getGuildCommand.file.default,
 editGuildCommand: importCache.editGuildCommand.file.default,
 deleteGuildCommand: importCache.deleteGuildCommand.file.default,
 bulkOverwriteGuildCommands: importCache.bulkOverwriteGuildCommands.file.default,
 getGuildCommandPermissions: importCache.getGuildCommandPermissions.file.default,
 getGuildCommandsPermissions: importCache.getGuildCommandsPermissions.file.default,
 editGuildCommandPermissions: importCache.editGuildCommandPermissions.file.default,
};

export default commands;
