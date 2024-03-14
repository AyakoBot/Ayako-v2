import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/TopGG.js';

const getVersion = async () => {
 const res = await fetch('https://top.gg/');
 const t = await res.text();
 return t
  .split('https://cdn.top.gg/builds/_next/static/')
  .filter((c) => c.includes('_buildManifest.js'))[0]
  .split('/_buildManifest.js')[0];
};

const getPages = async () => {
 const res = await fetch(
  `https://top.gg/_next/data/${await getVersion()}/en/bot/${process.env.mainID}.json`,
 );
 const json = (await res.json()) as CT.TopGGBotPage;
 return Math.ceil(json.pageProps.reviewStats.reviewCount / 20);
};

const getAllReviews = async () => {
 const pages = await getPages();
 return Promise.all(
  new Array(pages)
   .fill(null)
   .map((_, i) =>
    fetch(`https://top.gg/api/client/entities/${process.env.mainID}/reviews?page=${i + 1}`).then(
     (r) => r.json() as Promise<CT.TopGGReview[]>,
    ),
   ),
 );
};

const getUser = async (userId: string) => {
 const res = await fetch(`https://top.gg/_next/data/${await getVersion()}/en/user/${userId}.json`);
 return (await res.json()) as CT.TopGGUserPage;
};

export default async () => {
 await client.util.DataBase.reviews.deleteMany({
  where: { fetchat: { lt: Date.now() - 60000 } },
 });

 const oldReviews = await client.util.DataBase.reviews.findMany({ select: { userid: true } });
 const allReviews = await getAllReviews();
 const realUsers = await Promise.all(allReviews.flat().map((r) => getUser(r.posterId)));
 const newReviews = allReviews
  .flat()
  .filter(
   (r) =>
    !oldReviews.some(
     (o) =>
      o.userid ===
      realUsers.find((u) => u.pageProps.profile.internalUserId === r.posterId)?.pageProps.discordId,
    ),
  );

 newReviews.forEach(async (r) => {
  const realUserId = realUsers.find((u) => u.pageProps.profile.internalUserId === r.posterId)
   ?.pageProps.discordId;
  if (!realUserId) return;

  client.util.DataBase.reviews
   .create({
    data: {
     content: r.content,
     fetchat: Date.now(),
     userid: realUserId,
     score: r.score,
    },
   })
   .then();

  const dbUser = await client.util.DataBase.users.findUnique({
   where: { userid: realUserId },
  });
  if (dbUser && Number(dbUser.lastfetch) < Date.now() - 86400000) return;

  const user = await client.util.getUser(realUserId);
  if (!user) return;

  client.util.DataBase.users
   .upsert({
    where: { userid: realUserId },
    update: { username: user.username, avatar: user.displayAvatarURL(), lastfetch: Date.now() },
    create: {
     username: user.username,
     avatar: user.displayAvatarURL(),
     lastfetch: Date.now(),
     userid: realUserId,
    },
   })
   .then();
 });
};
