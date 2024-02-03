import importCache from '../importCache/BaseClient/UtilModules/requestHandler/users.js';

interface Users {
 get: typeof importCache.get.file.default;
 getCurrent: typeof importCache.getCurrent.file.default;
 getGuilds: typeof importCache.getGuilds.file.default;
 leaveGuild: typeof importCache.leaveGuild.file.default;
 edit: typeof importCache.edit.file.default;
 editCurrentGuildMember: typeof importCache.editCurrentGuildMember.file.default;
 createDM: typeof importCache.createDM.file.default;
 getCurrentConnections: typeof importCache.getCurrentConnections.file.default;
 getApplicationRoleConnection: typeof importCache.getApplicationRoleConnection.file.default;
 updateApplicationRoleConnection: typeof importCache.updateApplicationRoleConnection.file.default;
}

/**
 * Object containing methods for handling user-related requests.
 * @property {Function} get
 * - Method for getting a user by ID.
 * @property {Function} getCurrent
 * - Method for getting the current user.
 * @property {Function} getGuilds
 * - Method for getting the guilds that the current user is a member of.
 * @property {Function} leaveGuild
 * - Method for leaving a guild.
 * @property {Function} edit
 * - Method for editing a user.
 * @property {Function} editCurrentGuildMember
 * - Method for editing the current user's guild member data.
 * @property {Function} createDM
 * - Method for creating a direct message channel with a user.
 * @property {Function} getCurrentConnections
 * - Method for getting the current user's connections.
 * @property {Function} getApplicationRoleConnection
 * - Method for getting the current user's application role connection.
 * @property {Function} updateApplicationRoleConnection
 * - Method for updating the current user's application role connection.
 */
const users: Users = {
 get: importCache.get.file.default,
 getCurrent: importCache.getCurrent.file.default,
 getGuilds: importCache.getGuilds.file.default,
 leaveGuild: importCache.leaveGuild.file.default,
 edit: importCache.edit.file.default,
 editCurrentGuildMember: importCache.editCurrentGuildMember.file.default,
 createDM: importCache.createDM.file.default,
 getCurrentConnections: importCache.getCurrentConnections.file.default,
 getApplicationRoleConnection: importCache.getApplicationRoleConnection.file.default,
 updateApplicationRoleConnection: importCache.updateApplicationRoleConnection.file.default,
};

export default users;
