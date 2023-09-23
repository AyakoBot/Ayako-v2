import { User } from '../Other/classes.js';

interface bEvalUser {
 id: string;
 bot: boolean;
 system: boolean;
 flags: number;
 username: string;
 discriminator: string;
 avatar?: string;
 banner?: string;
 accentColor?: string;
 createdTimestamp: number;
 defaultAvatarURL: string;
 hexAccentColor?: string;
 tag: string;
 avatarURL?: string;
 displayAvatarURL: string;
 bannerURL?: string;
}

/**
 * Retrieves a user from the cache or fetches it from the API if not found in cache.
 * @param id The ID of the user to retrieve.
 * @returns A Promise that resolves with the User object if found, otherwise undefined.
 */
export default async (id: string) => {
 const client = (await import('../Client.js')).default;

 const response = (
  await client.shard?.broadcastEval((cl, { id: userID }) => cl.users.cache.get(userID), {
   context: { id },
  })
 )
  ?.flat()
  .find((u): u is bEvalUser => !!u);

 if (response) return new User(client, response);
 return client.users.fetch(id).catch(() => undefined);
};
