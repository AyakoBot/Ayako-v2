import importCache from '../importCache/BaseClient/UtilModules/requestHandler/webhooks.js';

interface Webhooks {
 get: typeof importCache.get.file.default;
 edit: typeof importCache.edit.file.default;
 delete: typeof importCache.delete.file.default;
 execute: typeof importCache.execute.file.default;
 executeSlack: typeof importCache.executeSlack.file.default;
 executeGitHub: typeof importCache.executeGitHub.file.default;
 getMessage: typeof importCache.getMessage.file.default;
 editMessage: typeof importCache.editMessage.file.default;
 deleteMessage: typeof importCache.deleteMessage.file.default;
}

/**
 * Helper methods for handling webhooks.
 * @property {Function} get
 * - Retrieves a webhook.
 * @property {Function} edit
 * - Edits a webhook.
 * @property {Function} delete
 * - Deletes a webhook.
 * @property {Function} execute
 * - Executes a webhook.
 * @property {Function} executeSlack
 * - Executes a Slack webhook.
 * @property {Function} executeGitHub
 * - Executes a GitHub webhook.
 * @property {Function} getMessage
 * - Retrieves a message from a webhook.
 * @property {Function} editMessage
 * - Edits a message from a webhook.
 * @property {Function} deleteMessage
 * - Deletes a message from a webhook.
 */
const webhooks: Webhooks = {
 get: importCache.get.file.default,
 edit: importCache.edit.file.default,
 delete: importCache.delete.file.default,
 execute: importCache.execute.file.default,
 executeSlack: importCache.executeSlack.file.default,
 executeGitHub: importCache.executeGitHub.file.default,
 getMessage: importCache.getMessage.file.default,
 editMessage: importCache.editMessage.file.default,
 deleteMessage: importCache.deleteMessage.file.default,
};

export default webhooks;
