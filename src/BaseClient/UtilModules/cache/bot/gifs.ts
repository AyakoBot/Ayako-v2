import * as Neko from 'nekos-best.js';
import { scheduleJob } from 'node-schedule';
import PurrBot from 'purrbot-api';
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
    new Array(Math.abs(10 - store.length)).fill(null).forEach(() => {
     self.getNew(name, type);
    });
   });

   return self.getNew(name, type);
  }

  const result = store.shift() || { url: undefined };
  self.cache.set(name, store);
  return result;
 },
 getNew: async (name, type, iteration = 0) => {
  if (iteration >= 10) return { url: undefined };

  const timeoutPromise = new Promise<ReturnType<'gif' | 'img'>>((_, reject) => {
   setTimeout(() => reject(new Error('Timeout')), 1000);
  });

  try {
   const gif = await Promise.race([fetchGif(name, type), timeoutPromise]);
   if (!gif) return self.getNew(name, type, iteration + 1);
   const store = self.cache.get(name) ?? self.cache.set(name, []).get(name)!;
   store.push(gif);

   return gif!;
  } catch (error) {
   return { url: undefined };
  }
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
 * An array of objects containing trigger words and corresponding functions to retrieve a GIF.
 * Each object has the following properties:
 * - triggers: an array of strings representing the trigger words for the GIF.
 * - gifs: an async function that returns a GIF based on the trigger words.
 * The function uses the getGif function to retrieve the GIF.
 */
const gifSelection = [
 { triggers: ['awoo'], gifs: async () => getGif('awoo', ['hardcoded']) },
 { triggers: ['angry'], gifs: async () => getGif('angry', ['purr', 'neko']) },
 { triggers: ['bath'], gifs: async () => getGif('bath', ['hardcoded']) },
 { triggers: ['ayaya'], gifs: async () => getGif('ayaya', ['hardcoded']) },
 { triggers: ['baka'], gifs: async () => getGif('baka', ['neko']) },
 { triggers: ['bite'], gifs: async () => getGif('bite', ['neko', 'purr']) },
 { triggers: ['blush'], gifs: async () => getGif('blush', ['neko', 'purr']) },
 { triggers: ['bonk'], gifs: async () => getGif('bonk', ['neko']) },
 { triggers: ['bored'], gifs: async () => getGif('bored', ['neko']) },
 { triggers: ['comfy'], gifs: async () => getGif('comfy', ['purr']) },
 { triggers: ['cry'], gifs: async () => getGif('cry', ['neko', 'purr']) },
 {
  triggers: ['snuggle', 'cuddle', 'nuzzle'],
  gifs: async () => getGif('cuddle', ['neko', 'purr']),
 },
 { triggers: ['dance'], gifs: async () => getGif('dance', ['neko', 'purr']) },
 { triggers: ['facepalm'], gifs: async () => getGif('facepalm', ['neko']) },
 { triggers: ['feed'], gifs: async () => getGif('feed', ['neko']) },
 { triggers: ['fluff', 'floof'], gifs: async () => getGif('fluff', ['purr']) },
 { triggers: ['handshake'], gifs: async () => getGif('handshake', ['neko']) },
 { triggers: ['happy'], gifs: async () => getGif('happy', ['neko']) },
 { triggers: ['highfive'], gifs: async () => getGif('highfive', ['neko']) },
 {
  triggers: ['handhold', 'holdhands'],
  gifs: async () => getGif('handhold', ['neko']),
 },
 {
  triggers: ['hug', 'comfort', 'hold'],
  gifs: async () => getGif('hug', ['neko', 'purr']),
 },
 { triggers: ['laugh'], gifs: async () => getGif('laugh', ['neko']) },
 { triggers: ['lay'], gifs: async () => getGif('lay', ['purr']) },
 { triggers: ['lick'], gifs: async () => getGif('lick', ['purr']) },
 { triggers: ['lift', 'pickup', 'carry', 'kidnap'], gifs: async () => getGif('carry', ['neko']) },
 { triggers: ['lurk', 'peek'], gifs: async () => getGif('lurk', ['neko']) },
 { triggers: ['nom', 'nam', 'nibble'], gifs: async () => getGif('nom', ['hardcoded']) },
 { triggers: ['nya', 'mew', 'meow'], gifs: async () => getGif('nya', ['neko']) },
 { triggers: ['pat', 'pet'], gifs: async () => getGif('pat', ['neko', 'purr']) },
 { triggers: ['peck'], gifs: async () => getGif('peck', ['neko']) },
 { triggers: ['peck', 'blowkiss'], gifs: async () => getGif('blowkiss', ['neko']) },
 { triggers: ['poke', 'boop'], gifs: async () => getGif('poke', ['neko', 'purr']) },
 { triggers: ['pout', 'hmpf', 'hmph'], gifs: async () => getGif('pout', ['neko', 'purr']) },
 { triggers: ['quack'], gifs: async () => getGif('quack', ['hardcoded']) },
 { triggers: ['run'], gifs: async () => getGif('run', ['neko']) },
 { triggers: ['scream'], gifs: async () => getGif('scream', ['hardcoded']) },
 { triggers: ['shake'], gifs: async () => getGif('shake', ['neko']) },
 { triggers: ['shrug'], gifs: async () => getGif('shrug', ['neko']) },
 {
  triggers: ['slap', 'hit', 'punch'],
  gifs: async () => getGif('slap', ['neko', 'purr']),
 },
 { triggers: ['slap', 'hit', 'punch'], gifs: async () => getGif('punch', ['neko']) },
 { triggers: ['sleep', 'eep'], gifs: async () => getGif('sleep', ['neko']) },
 { triggers: ['smile'], gifs: async () => getGif('smile', ['neko', 'purr']) },
 { triggers: ['smug'], gifs: async () => getGif('smug', ['neko']) },
 { triggers: ['smug', 'teehee'], gifs: async () => getGif('teehee', ['neko']) },
 { triggers: ['stare'], gifs: async () => getGif('stare', ['neko']) },
 { triggers: ['tail', 'wag', 'tailwag'], gifs: async () => getGif('tail', ['purr', 'neko']) },
 { triggers: ['thighsleep', 'lapsleep'], gifs: async () => getGif('lappillow', ['neko']) },
 { triggers: ['think'], gifs: async () => getGif('think', ['neko']) },
 { triggers: ['thumbsup'], gifs: async () => getGif('thumbsup', ['neko']) },
 { triggers: ['tickle'], gifs: async () => getGif('tickle', ['neko', 'purr']) },
 { triggers: ['wave'], gifs: async () => getGif('wave', ['neko']) },
 { triggers: ['wink'], gifs: async () => getGif('wink', ['neko']) },
 { triggers: ['yeet'], gifs: async () => getGif('yeet', ['neko']) },
 { triggers: ['yawn'], gifs: async () => getGif('yawn', ['neko']) },
 { triggers: ['woof'], gifs: async () => getGif('woof', ['hardcoded']) },
 {
  triggers: ['kiss', 'kith', 'smooch', 'pash', 'mwah'],
  gifs: async () => getGif('kiss', ['neko', 'purr']),
 },
 { triggers: ['shoot'], gifs: async () => getGif('shoot', ['neko']) },
 { triggers: ['waifu'], gifs: async () => getGif('waifu', ['neko']) },
 { triggers: ['husbando'], gifs: async () => getGif('husbando', ['neko']) },
 { triggers: ['eevee'], gifs: async () => getGif('eevee', ['purr']) },
 { triggers: ['holo'], gifs: async () => getGif('holo', ['purr']) },
 { triggers: ['icon'], gifs: async () => getGif('icon', ['purr']) },
 { triggers: ['kitsune'], gifs: async () => getGif('kitsune', ['purr', 'neko']) },
 { triggers: ['neko'], gifs: async () => getGif('neko', ['purr', 'neko']) },
 { triggers: ['okami'], gifs: async () => getGif('okami', ['purr']) },
 { triggers: ['senko'], gifs: async () => getGif('senko', ['purr']) },
 { triggers: ['shiro'], gifs: async () => getGif('shiro', ['purr']) },
 { triggers: ['nod'], gifs: async () => getGif('nod', ['neko']) },
 { triggers: ['nope'], gifs: async () => getGif('nope', ['neko']) },

 { triggers: ['kick'], gifs: async () => getGif('kick', ['neko']) },
 { triggers: ['spin'], gifs: async () => getGif('spin', ['neko']) },
 { triggers: ['tableflip'], gifs: async () => getGif('tableflip', ['neko']) },
 { triggers: ['salute'], gifs: async () => getGif('salute', ['neko']) },
 { triggers: ['shocked'], gifs: async () => getGif('shocked', ['neko']) },
 { triggers: ['sip'], gifs: async () => getGif('sip', ['neko']) },
 { triggers: ['kabedon'], gifs: async () => getGif('kabedon', ['neko']) },
 { triggers: ['bleh'], gifs: async () => getGif('bleh', ['neko']) },
 { triggers: ['clap'], gifs: async () => getGif('clap', ['neko']) },
 { triggers: ['confused'], gifs: async () => getGif('confused', ['neko']) },
];

export default gifSelection;
