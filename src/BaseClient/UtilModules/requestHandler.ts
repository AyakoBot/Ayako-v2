import { API as DAPI, type APIGuild, type APIPartialInteractionGuild } from '@discordjs/core';
import {
 DiscordAPIError,
 REST,
 RESTEvents,
 type APIRequest,
 type RateLimitData,
 type ResponseLike,
} from '@discordjs/rest';

import { API } from '../Bot/Client.js';
import DataBase from '../Bot/DataBase.js';
import cache from './cache.js';

import rateLimited from '../../Events/RestEvents/rateLimited.js';
import response from '../../Events/RestEvents/response.js';
import restDebug from '../../Events/RestEvents/restDebug.js';

import applications from './requestHandler/applications.js';
import channels from './requestHandler/channels.js';
import commands from './requestHandler/commands.js';
import guilds from './requestHandler/guilds.js';
import invites from './requestHandler/invites.js';
import stageInstances from './requestHandler/stageInstances.js';
import stickers from './requestHandler/stickers.js';
import threads from './requestHandler/threads.js';
import users from './requestHandler/users.js';
import voice from './requestHandler/voice.js';
import webhooks from './requestHandler/webhooks.js';

/**
 * Sets up a new API instance for the given guild ID and token.
 * @param guildId - The ID of the guild to set up the API for.
 * @param token - The token to use for authentication.
 * @returns boolean indicating success
 */
const requestHandler = async (guildId: string, token: string): Promise<boolean> => {
 if (cache.apis.has(guildId)) return true;

 const rest = new REST({
  version: '10',
  api: 'http://nirn:8080/api',
  timeout: 60000,
 }).setToken(token);

 const api = new DAPI(rest);

 const canGetOwnGuild = await getOwnGuild(guildId, api);
 if (!canGetOwnGuild) return false;

 rest.on(RESTEvents.Debug, (info: string) => restDebug(info));
 rest.on(RESTEvents.RateLimited, (info: RateLimitData) => rateLimited(info));
 rest.on(RESTEvents.Response, (req: APIRequest, res: ResponseLike) => response(req, res));

 cache.apis.set(guildId, api);
 return true;
};

const getOwnGuild = async (guildId: string, api: DAPI) => {
 const guild = await api.guilds
  .get(guildId, { with_counts: false })
  .catch((e: DiscordAPIError) => e);

 if ('message' in guild) return false;
 return true;
};

export default requestHandler;

export const makeRequestHandler = async (guild: APIGuild | APIPartialInteractionGuild) => {
 const ccSettings = await DataBase.customclients.findUnique({
  where: { guildid: guild.id, token: { not: null } },
 });
 if (!ccSettings) return false;

 const success = await requestHandler(guild.id, ccSettings.token!);
 if (!success) return false;
 return true;
};

export const request = {
 applications,
 commands,
 channels,
 guilds,
 webhooks,
 interactions: API.interactions,
 invites,
 oAuth2: API.oauth2,
 roleConnections: API.roleConnections,
 stageInstances,
 stickers,
 threads,
 users,
 voice,
};
