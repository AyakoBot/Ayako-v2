/* eslint-disable no-console */
import 'dotenv/config';
import sms from 'source-map-support';

import client from './BaseClient/Bot/Client.js';
import util from './BaseClient/Bot/Util.js';
import './BaseClient/Bot/Events.js';

client.util = util;

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

if (process.argv.includes('--debug')) console.log('[DEBUG] Debug mode enabled');
if (process.argv.includes('--debug-db')) console.log('[DEBUG] Debug mode for database enabled');
if (process.argv.includes('--warn')) console.log('[DEBUG] Warn mode enabled');
if (process.argv.includes('--silent')) console.log('[DEBUG] Silent mode enabled');
