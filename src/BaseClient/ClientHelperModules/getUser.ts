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
