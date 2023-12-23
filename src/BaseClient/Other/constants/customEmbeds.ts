export default {
 type: {
  'author-name': 'string',
  'author-icon': 'img',
  'author-url': 'link',
  thumbnail: 'img',
  title: 'string',
  url: 'link',
  description: 'string',
  image: 'img',
  color: 'hex',
  'footer-text': 'string',
  'footer-icon': 'img',
  timestamp: 'timestamp',
 },
 needsOneOf: ['title', 'author-name', 'description', 'thumbnail', 'fields', 'image', 'footer-text'],
};
