import { createBookmarkApp } from './ui.js';

const seed = [
  { id: '1', title: 'OpenAI', url: 'https://openai.com', tags: ['ai', 'tools'] },
  { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', tags: ['docs', 'web'] }
];

const root = document.getElementById('app');
const app = createBookmarkApp(root, seed);
app.render();
