import create from './stageInstances/create.js';
import get from './stageInstances/get.js';
import edit from './stageInstances/edit.js';
import del from './stageInstances/delete.js';

interface StageInstances {
 create: typeof create;
 get: typeof get;
 edit: typeof edit;
 delete: typeof del;
}

/**
 * Helper methods for interacting with Stage Instances.
 * @property {Function} create
 * - Creates a new Stage Instance.
 * @property {Function} get
 * - Gets a Stage Instance by ID.
 * @property {Function} edit
 * - Edits an existing Stage Instance.
 * @property {Function} delete
 * - Deletes a Stage Instance by ID.
 */
const stageInstances: StageInstances = {
 create,
 get,
 edit,
 delete: del,
};

export default stageInstances;
