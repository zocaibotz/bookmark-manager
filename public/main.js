const form = document.getElementById('bookmark-form');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const searchInput = document.getElementById('search');
const list = document.getElementById('bookmark-list');

async function fetchBookmarks(query = '') {
  const params = new URLSearchParams();
  if (query) params.set('q', query);

  const response = await fetch(`/api/bookmarks?${params.toString()}`);
  if (!response.ok) throw new Error('Unable to load bookmarks');

  return response.json();
}

function render(items) {
  list.innerHTML = '';
  for (const item of items) {
    const row = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'meta';

    const title = document.createElement('strong');
    title.textContent = item.title;

    const url = document.createElement('span');
    url.className = 'url';
    url.textContent = item.url;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Delete';
    removeButton.addEventListener('click', async () => {
      await fetch(`/api/bookmarks/${item.id}`, { method: 'DELETE' });
      await reload();
    });

    meta.append(title, url);
    row.append(meta, removeButton);
    list.append(row);
  }
}

async function reload() {
  const items = await fetchBookmarks(searchInput.value.trim());
  render(items);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: titleInput.value.trim(),
      url: urlInput.value.trim()
    })
  });

  form.reset();
  titleInput.focus();
  await reload();
});

searchInput.addEventListener('input', async () => {
  await reload();
});

await reload();
