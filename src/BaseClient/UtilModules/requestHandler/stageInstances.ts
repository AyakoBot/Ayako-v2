import importCache from '../importCache/BaseClient/UtilModules/requestHandler/stageInstances.js';

interface StageInstances {
 create: typeof importCache.create.file.default;
 get: typeof importCache.get.file.default;
 edit: typeof importCache.edit.file.default;
 delete: typeof importCache.delete.file.default;
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
 create: importCache.create.file.default,
 get: importCache.get.file.default,
 edit: importCache.edit.file.default,
 delete: importCache.delete.file.default,
};

export default stageInstances;
