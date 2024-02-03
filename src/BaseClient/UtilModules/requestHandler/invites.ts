import importCache from '../importCache/BaseClient/UtilModules/requestHandler/invites.js';

interface Invites {
 get: typeof importCache.get.file.default;
 delete: typeof importCache.delete.file.default;
}

/**
 * Object containing methods for handling invites.
 * @property {Function} get
 * - Method for getting an invite.
 * @property {Function} delete
 * - Method for deleting an invite.
 */
const invites: Invites = {
 get: importCache.get.file.default,
 delete: importCache.delete.file.default,
};

export default invites;
