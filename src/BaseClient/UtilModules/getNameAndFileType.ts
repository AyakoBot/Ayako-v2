/**
 * Extracts the name and file type from a URL.
 * @param url - The URL to extract the name and file type from.
 * @returns The name and file type of the URL.
 */
export default (url: string) => {
 const splitByQuestionMark = url.split(/\//g).at(-1)?.split(/\?/g);
 return splitByQuestionMark?.[0];
};
