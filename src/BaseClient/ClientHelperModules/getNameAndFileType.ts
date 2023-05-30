export default (url: string) => {
 const splitByQuestionMark = url.split(/\//g).at(-1)?.split(/\?/g);
 return splitByQuestionMark?.[0];
};
