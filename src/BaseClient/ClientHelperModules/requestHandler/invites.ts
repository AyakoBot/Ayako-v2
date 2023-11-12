import get from './invites/get.js';
import del from './invites/delete.js';

/**
 * Object containing methods for handling invites.
 * @property {Function} get
 * - Method for getting an invite.
 * @property {Function} delete
 * - Method for deleting an invite.
 */
export default {
 get,
 delete: del,
};
