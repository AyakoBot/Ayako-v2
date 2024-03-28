import puppeteer, { VanillaPuppeteer } from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/TopGG.js';

puppeteer.use(stealth());
let browser: Awaited<ReturnType<VanillaPuppeteer['launch']>> | null = null;

const getContentFromURL = async (url: string) => {
 const page = await browser!.newPage();
 await page.goto(url);
 await client.util.sleep(2000);
 const pageSourceHTML = await page.content();
 page.close();

 return pageSourceHTML;
};

const extractJSON = (content: string) => JSON.parse(content.split('<pre>')[1].split('</pre>')[0]);

const getVersion = async () =>
 (await getContentFromURL('https://top.gg'))
  .split('https://cdn.top.gg/builds/_next/static/')
  .filter((c) => c.includes('_buildManifest.js'))[0]
  .split('/_buildManifest.js')[0];

const getPages = async (version: string) =>
 Math.ceil(
  (
   extractJSON(
    await getContentFromURL(
     `https://top.gg/_next/data/${version}/en/bot/${process.env.mainID}.json`,
    ),
   ) as CT.TopGGBotPage
  ).pageProps.reviewStats.reviewCount / 20,
 );

const getAllReviews = async (version: string) => {
 const reviews: CT.TopGGReview[][] = [];
 const pages = await getPages(version);

 for (let i = 0; i < pages; i += 1) {
  reviews.push(
   extractJSON(
    // eslint-disable-next-line no-await-in-loop
    await getContentFromURL(
     `https://top.gg/api/client/entities/${process.env.mainID}/reviews?page=${i + 1}`,
    ),
   ) as CT.TopGGReview[],
  );
 }

 return reviews.flat();
};

const getUser = async (userId: string, version: string) =>
 extractJSON(
  await getContentFromURL(`https://top.gg/_next/data/${version}/en/user/${userId}.json`),
 );

export default async () => {
 browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

 await client.util.DataBase.reviews.deleteMany({
  where: { fetchat: { lt: Date.now() - 60000 } },
 });

 const version = await getVersion();
 const oldReviews = await client.util.DataBase.reviews.findMany({ select: { userid: true } });
 const allReviews = await getAllReviews(version);

 const realUsers: CT.TopGGUserPage[] = [];
 for (let i = 0; i < allReviews.length; i += 1) {
  // eslint-disable-next-line no-await-in-loop
  realUsers.push((await getUser(allReviews[i].posterId, version)) as CT.TopGGUserPage);
 }

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

 await browser.close();
};
