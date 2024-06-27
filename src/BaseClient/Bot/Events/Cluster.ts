import baseEventHandler from '../../../Events/BotEvents/baseEventHandler.js';
import { MessageType } from '../../../Typings/Typings.js';
import type * as Redis from '../../Cluster/Redis.js';
import client from '../Client.js';

client.cluster?.on('message', (message) => {
 const m = message as Redis.Message<MessageType>;

 if (typeof m !== 'object' || !('type' in m)) return;
 if (!m.type) return;

 baseEventHandler(m.type, [message]);
});
