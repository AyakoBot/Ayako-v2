import get from './webhooks/get.js';
import edit from './webhooks/edit.js';
import del from './webhooks/delete.js';
import execute from './webhooks/execute.js';
import executeSlack from './webhooks/executeSlack.js';
import executeGitHub from './webhooks/executeGitHub.js';
import getMessage from './webhooks/getMessage.js';
import editMessage from './webhooks/editMessage.js';
import deleteMessage from './webhooks/deleteMessage.js';

interface Webhooks {
 get: typeof get;
 edit: typeof edit;
 delete: typeof del;
 execute: typeof execute;
 executeSlack: typeof executeSlack;
 executeGitHub: typeof executeGitHub;
 getMessage: typeof getMessage;
 editMessage: typeof editMessage;
 deleteMessage: typeof deleteMessage;
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
 get,
 edit,
 delete: del,
 execute,
 executeSlack,
 executeGitHub,
 getMessage,
 editMessage,
 deleteMessage,
};

export default webhooks;
