import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

let nextId = 1;
const bookmarks = [];

app.get('/api/bookmarks', (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();
  const results = q
    ? bookmarks.filter((item) => item.title.toLowerCase().includes(q))
    : bookmarks;

  res.json(results);
});

app.post('/api/bookmarks', (req, res) => {
  const title = (req.body?.title || '').toString().trim();
  const url = (req.body?.url || '').toString().trim();

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' });
  }

  const bookmark = { id: nextId++, title, url };
  bookmarks.push(bookmark);
  res.status(201).json(bookmark);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = bookmarks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'bookmark not found' });
  }

  bookmarks.splice(index, 1);
  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});
