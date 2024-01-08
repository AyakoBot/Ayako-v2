import get from './invites/get.js';
import del from './invites/delete.js';

interface Invites {
 get: typeof get;
 delete: typeof del;
}

/**
 * Object containing methods for handling invites.
 * @property {Function} get
 * - Method for getting an invite.
 * @property {Function} delete
 * - Method for deleting an invite.
 */
const invites: Invites = {
 get,
 delete: del,
};

export default invites;
