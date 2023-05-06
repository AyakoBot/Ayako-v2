export default (url: string) => {
 const splitByQuestionMark = url.split(/\//g)[url.split(/\//g).length - 1].split(/\?/g);
 return splitByQuestionMark[0];
};
