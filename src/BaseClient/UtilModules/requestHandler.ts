import * as DiscordRest from '@discordjs/rest';
import * as DiscordCore from '@discordjs/core';
import cache from './cache.js';
import { API } from '../Bot/Client.js';

import applications from './requestHandler/applications.js';
import commands from './requestHandler/commands.js';
import channels from './requestHandler/channels.js';
import guilds from './requestHandler/guilds.js';
import webhooks from './requestHandler/webhooks.js';
import invites from './requestHandler/invites.js';
import stageInstances from './requestHandler/stageInstances.js';
import stickers from './requestHandler/stickers.js';
import threads from './requestHandler/threads.js';
import users from './requestHandler/users.js';
import voice from './requestHandler/voice.js';

/**
 * Sets up a new API instance for the given guild ID and token.
 * @param guildId - The ID of the guild to set up the API for.
 * @param token - The token to use for authentication.
 */
export default async (guildId: string, token: string) => {
 const rest = new DiscordRest.REST({
  version: '10',
  api: 'http://nirn:8080/api',
  timeout: 60000,
 }).setToken(token);
 const api = new DiscordCore.API(rest);
 cache.apis.set(guildId, api);
};

export const request = {
 applications,
 commands,
 channels,
 guilds,
 webhooks,
 invites,
 oAuth2: API.oauth2,
 roleConnections: API.roleConnections,
 stageInstances,
 stickers,
 threads,
 users,
 voice,
};
