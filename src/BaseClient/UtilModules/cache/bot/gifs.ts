import * as Neko from 'nekos-best.js';
import { scheduleJob } from 'node-schedule';
import PurrBot from 'purrbot-api';
import WaifuPics, { type SFWCategories as WaifuGifNames } from 'waifu-pics-api';
import hardcodedGifs from '../../../Other/constants/gifs.js';
import getPathFromError from '../../getPathFromError.js';
import getRandom from '../../getRandom.js';

const nekoClient = new Neko.Client();

/**
 * Represents the Gifs interface.
 */
export interface Gifs {
 /**
  * Retrieves a gif or image by name and type.
  * @param name - The name of the gif or image.
  * @param type - The type of the gif or image.
  * @returns A promise that resolves to the requested gif or image.
  */
 get: <T extends 'gif' | 'img'>(
  name: string,
  type: Type[],
 ) => Promise<ReturnType<T>> | ReturnType<T>;

 /**
  * Retrieves a new gif or image by name and type.
  * @param gif - The name of the gif or image.
  * @param type - The type of the gif or image.
  * @returns A promise that resolves to the requested gif or image.
  */
 getNew: (gif: string, type: Type[], iteration?: number) => Promise<ReturnType<'gif' | 'img'>>;

 /**
  * A cache map that stores the cached gifs or images.
  */
 cache: Map<string, ReturnType<'img' | 'gif'>[]>;
}

export const self: Gifs = {
 get: (name, type) => {
  const store = self.cache.get(name) ?? self.cache.set(name, []).get(name)!;
  if (store.length > 10) store.splice(0, store.length - 10);

  self.cache.set(
   name,
   store.filter((s) => s.url?.length),
  );

  if (store.length !== 10) {
   scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 5000), () => {
    for (let i = 0; i < Math.abs(10 - store.length); i += 1) {
     self.getNew(name, type);
    }
   });

   return self.getNew(name, type);
  }

  return store.shift() || { url: undefined };
 },
 getNew: async (name, type, iteration = 0) => {
  if (iteration >= 10) return { url: undefined };

  const gif = await fetchGif(name, type);
  if (!gif) return self.getNew(name, type, iteration + 1);
  const store = self.cache.get(name) ?? self.cache.set(name, []).get(name)!;
  store.push(gif);

  return gif!;
 },
 cache: new Map(),
};

/**
 * The return type of the `getGif` function.
 * @property img - An object containing information about an image.
 * @property img.artist - The artist of the image.
 * @property img.source - The source of the image.
 * @property img.url - The URL of the image.
 * @property img.artistUrl - The URL of the artist's page.
 * @property gif - An object containing information about a GIF.
 * @property gif.anime_name - The name of the anime the GIF is from.
 * @property gif.url - The URL of the GIF.
 */
export type ReturnType<T extends 'gif' | 'img'> = {
 img: { artist?: string; source?: string; url: string | undefined; artistUrl?: string };
 gif: { anime_name?: string; url: string | undefined };
}[T];

type Type = 'purr' | 'neko' | 'hardcoded' | 'waifu';

/**
 * Returns a random GIF or image based on the provided parameters.
 * @param gifName - The name of the GIF to retrieve.
 * @param type - An array of strings representing the type of GIF to retrieve.
 * @returns A Promise that resolves to an object containing the URL of the retrieved GIF or image.
 * The type of the returned object depends on the value of the `T` type parameter.
 * If `T` is `'gif'`, the returned object will have a `url` property of type `string`.
 * If `T` is `'img'`, the returned object will have a `url` property of type `string`
 * and an optional `anime_name`, `artist`, `source`, or `artistUrl` property.
 * @throws An error if the `type` parameter is invalid.
 * @typeParam T - A type parameter that determines the type of the returned object.
 * Must be either `'gif'` or `'img'`.
 */
const fetchGif = async <T extends 'gif' | 'img'>(
 gifName: string,
 type: Type[],
): Promise<ReturnType<T>> => {
 switch (type[Math.ceil(Math.random() * (type.length - 1))]) {
  case 'purr':
   return purr(gifName, type);
  case 'neko':
   return neko(gifName, type);
  case 'waifu':
   return waifu(gifName, type);
  case 'hardcoded': {
   const gifs = hardcodedGifs[gifName as keyof typeof hardcodedGifs];

   return { url: gifs[getRandom(0, gifs.length)] };
  }
  default:
   throw new Error('Invalid type');
 }
};

/**
 * Retrieves a GIF or image based on the provided name and type.
 * @param gifName - The name of the GIF or image to retrieve.
 * @param type - An array of types to specify whether to retrieve a GIF or an image.
 * @returns A promise that resolves to the retrieved GIF or image.
 */
const getGif = async <T extends 'gif' | 'img'>(
 gifName: string,
 type: Type[],
): Promise<ReturnType<T>> => self.get(gifName, type);

/**
 * Fetches a neko gif based on the given gifName and type.
 * @param gifName - The name of the gif to fetch.
 * @param type - An array of types to filter the gif search.
 * @returns A promise that resolves to an object containing the URL of the gif,
 * and optionally the anime name, artist name, source URL, and artist URL.
 */
const neko = async (gifName: string, type: Type[]) => {
 const res = (await nekoClient.fetch(gifName as Neko.NbCategories, 1).catch(() => undefined))
  ?.results[0];

 if (type.length > 2 && !res) {
  return getGif(
   gifName,
   type.filter((t) => t !== 'neko'),
  );
 }

 if (!res) return { url: '' };

 return 'anime_name' in res
  ? { url: res.url, anime_name: res.anime_name }
  : {
     url: res.url,
     artist: res.artist_name,
     source: res.source_url,
     artistUrl: res.artist_href,
    };
};

/**
 * Retrieves a random purr GIF or image URL based on the given gifName and type.
 * @param gifName - The name of the GIF category.
 * @param type - An array of types to filter the GIFs.
 * @returns An object containing the URL of the purr GIF or image.
 */
const purr = async (gifName: string, type: Type[]) => {
 const functionToCall = ['img', 'gif'][Math.floor(Math.random() * 2)] ?? 'img';

 const url = await PurrBot.sfw.categories[gifName as keyof typeof PurrBot.sfw.categories](
  functionToCall as 'gif' | 'img',
 ).catch(() => undefined);

 if (type.length > 2 && !url) {
  return getGif(
   gifName,
   type.filter((t) => t !== 'purr'),
  );
 }

 return { url: url ?? '' };
};

/**
 * Retrieves a waifu GIF URL based on the given GIF name and type.
 * If the GIF name is not found or the type array contains more than 2 types and no URL is found,
 * it falls back to getGif.
 * @param gifName - The name of the GIF.
 * @param type - An array of types.
 * @returns An object containing the GIF URL, or an empty string if no URL is found.
 */
const waifu = async (gifName: string, type: Type[]) => {
 const url = await WaifuPics(gifName as WaifuGifNames).catch(() => undefined);

 if (type.length > 2 && !url) {
  return getGif(
   gifName,
   type.filter((t) => t !== 'waifu'),
  );
 }

 return { url: url ?? '' };
};

/**
 * An array of objects containing trigger words and corresponding functions to retrieve a GIF.
 * Each object has the following properties:
 * - triggers: an array of strings representing the trigger words for the GIF.
 * - gifs: an async function that returns a GIF based on the trigger words.
 * The function uses the getGif function to retrieve the GIF.
 */
const gifSelection = [
 { triggers: ['awoo'], gifs: async () => getGif('awoo', ['waifu']) },
 { triggers: ['angry'], gifs: async () => getGif('angry', ['purr']) },
 { triggers: ['bath'], gifs: async () => getGif('bath', ['hardcoded']) },
 { triggers: ['ayaya'], gifs: async () => getGif('ayaya', ['hardcoded']) },
 { triggers: ['baka'], gifs: async () => getGif('baka', ['neko']) },
 { triggers: ['bite'], gifs: async () => getGif('bite', ['neko', 'purr', 'waifu']) },
 { triggers: ['blush'], gifs: async () => getGif('blush', ['neko', 'purr', 'waifu']) },
 { triggers: ['bonk'], gifs: async () => getGif('bonk', ['waifu']) },
 { triggers: ['bored'], gifs: async () => getGif('bored', ['neko']) },
 { triggers: ['comfy'], gifs: async () => getGif('comfy', ['purr']) },
 { triggers: ['cry'], gifs: async () => getGif('cry', ['neko', 'purr', 'waifu']) },
 {
  triggers: ['snuggle', 'cuddle', 'nuzzle'],
  gifs: async () => getGif('cuddle', ['neko', 'purr', 'waifu']),
 },
 { triggers: ['snuggle', 'cuddle', 'nuzzle'], gifs: async () => getGif('glomp', ['waifu']) },
 { triggers: ['dance'], gifs: async () => getGif('dance', ['neko', 'purr', 'waifu']) },
 { triggers: ['facepalm'], gifs: async () => getGif('facepalm', ['neko']) },
 { triggers: ['feed'], gifs: async () => getGif('feed', ['neko']) },
 { triggers: ['fluff', 'floof'], gifs: async () => getGif('fluff', ['purr']) },
 { triggers: ['handshake'], gifs: async () => getGif('handshake', ['neko']) },
 { triggers: ['happy'], gifs: async () => getGif('happy', ['neko', 'waifu']) },
 { triggers: ['highfive'], gifs: async () => getGif('highfive', ['neko', 'waifu']) },
 {
  triggers: ['handhold', 'holdhands'],
  gifs: async () => getGif('handhold', ['neko', 'waifu']),
 },
 {
  triggers: ['hug', 'comfort', 'hold'],
  gifs: async () => getGif('hug', ['neko', 'purr', 'waifu']),
 },
 { triggers: ['kidnap'], gifs: async () => getGif('kidnap', ['hardcoded']) },
 { triggers: ['laugh'], gifs: async () => getGif('laugh', ['neko']) },
 { triggers: ['lay'], gifs: async () => getGif('lay', ['purr']) },
 { triggers: ['lick'], gifs: async () => getGif('lick', ['purr', 'waifu']) },
 { triggers: ['lift', 'pickup'], gifs: async () => getGif('lift', ['hardcoded']) },
 { triggers: ['lurk', 'peek'], gifs: async () => getGif('lurk', ['neko']) },
 { triggers: ['nom', 'nam', 'nibble'], gifs: async () => getGif('nom', ['hardcoded']) },
 { triggers: ['nya', 'mew'], gifs: async () => getGif('nya', ['hardcoded']) },
 { triggers: ['pat', 'pet'], gifs: async () => getGif('pat', ['neko', 'purr', 'waifu']) },
 { triggers: ['peck'], gifs: async () => getGif('peck', ['neko']) },
 { triggers: ['poke', 'boop'], gifs: async () => getGif('poke', ['neko', 'purr', 'waifu']) },
 { triggers: ['pout', 'hmpf', 'hmph'], gifs: async () => getGif('pout', ['neko', 'purr']) },
 { triggers: ['quack'], gifs: async () => getGif('quack', ['hardcoded']) },
 { triggers: ['run'], gifs: async () => getGif('run', ['hardcoded']) },
 { triggers: ['scream'], gifs: async () => getGif('scream', ['hardcoded']) },
 { triggers: ['shake'], gifs: async () => getGif('shake', ['hardcoded']) },
 { triggers: ['shrug'], gifs: async () => getGif('shrug', ['neko']) },
 {
  triggers: ['slap', 'hit', 'punch'],
  gifs: async () => getGif('slap', ['neko', 'purr', 'waifu']),
 },
 { triggers: ['slap', 'hit', 'punch'], gifs: async () => getGif('punch', ['neko']) },
 { triggers: ['sleep', 'eep'], gifs: async () => getGif('sleep', ['neko']) },
 { triggers: ['smile'], gifs: async () => getGif('smile', ['neko', 'purr', 'waifu']) },
 { triggers: ['smug'], gifs: async () => getGif('smug', ['neko', 'waifu']) },
 { triggers: ['stare'], gifs: async () => getGif('stare', ['neko']) },
 { triggers: ['tail', 'wag', 'tailwag'], gifs: async () => getGif('tail', ['purr']) },
 { triggers: ['thighsleep', 'lapsleep'], gifs: async () => getGif('thighsleep', ['hardcoded']) },
 { triggers: ['think'], gifs: async () => getGif('think', ['neko']) },
 { triggers: ['thumbsup'], gifs: async () => getGif('thumbsup', ['neko']) },
 { triggers: ['tickle'], gifs: async () => getGif('tickle', ['neko', 'purr']) },
 { triggers: ['wave'], gifs: async () => getGif('wave', ['neko', 'waifu']) },
 { triggers: ['wink'], gifs: async () => getGif('wink', ['neko', 'waifu']) },
 { triggers: ['yeet'], gifs: async () => getGif('yeet', ['neko', 'waifu']) },
 { triggers: ['yawn'], gifs: async () => getGif('yawn', ['neko']) },
 { triggers: ['woof'], gifs: async () => getGif('woof', ['hardcoded']) },
 {
  triggers: ['kiss', 'kith', 'smooch', 'pash', 'mwah'],
  gifs: async () => getGif('kiss', ['neko', 'purr', 'waifu']),
 },
 { triggers: ['shoot'], gifs: async () => getGif('shoot', ['neko']) },
 { triggers: ['waifu'], gifs: async () => getGif('waifu', ['neko', 'waifu']) },
 { triggers: ['husbando'], gifs: async () => getGif('husbando', ['neko']) },
 { triggers: ['eevee'], gifs: async () => getGif('eevee', ['purr']) },
 { triggers: ['holo'], gifs: async () => getGif('holo', ['purr']) },
 { triggers: ['icon'], gifs: async () => getGif('icon', ['purr']) },
 { triggers: ['kitsune'], gifs: async () => getGif('kitsune', ['purr', 'neko']) },
 { triggers: ['neko'], gifs: async () => getGif('neko', ['purr', 'neko', 'waifu']) },
 { triggers: ['okami'], gifs: async () => getGif('okami', ['purr']) },
 { triggers: ['senko'], gifs: async () => getGif('senko', ['purr']) },
 { triggers: ['shiro'], gifs: async () => getGif('shiro', ['purr']) },
 { triggers: ['nod'], gifs: async () => getGif('nod', ['neko']) },
 { triggers: ['nope'], gifs: async () => getGif('nope', ['neko']) },
 { triggers: ['shinobu'], gifs: async () => getGif('shinobu', ['waifu']) },
 { triggers: ['megumin'], gifs: async () => getGif('megumin', ['waifu']) },
 { triggers: ['bully'], gifs: async () => getGif('bully', ['waifu']) },
 { triggers: ['kill'], gifs: async () => getGif('kill', ['waifu']) },
 { triggers: ['kick'], gifs: async () => getGif('kick', ['neko', 'waifu']) },
 { triggers: ['cringe'], gifs: async () => getGif('cringe', ['waifu']) },
];

export default gifSelection;
