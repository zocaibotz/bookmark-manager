import {
  validateBookmark,
  filterBookmarks,
  addBookmark,
  editBookmark,
  deleteBookmark,
  normalizeTags
} from './bookmarks.js';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function createBookmarkApp(container, initialBookmarks = []) {
  const state = {
    bookmarks: initialBookmarks,
    search: '',
    activeTag: '',
    editingId: null,
    errors: {}
  };

  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const url = String(data.get('url') || '').trim();
    const tags = normalizeTags(String(data.get('tags') || ''));

    const validation = validateBookmark({ title, url });
    state.errors = validation.errors;

    if (!validation.valid) {
      render();
      return;
    }

    if (state.editingId) {
      state.bookmarks = editBookmark(state.bookmarks, state.editingId, { title, url, tags });
      state.editingId = null;
    } else {
      state.bookmarks = addBookmark(state.bookmarks, { id: genId(), title, url, tags });
    }

    state.errors = {};
    form.reset();
    render();
  }

  function onDelete(id, title) {
    if (!window.confirm(`Delete ${title}?`)) return;
    state.bookmarks = deleteBookmark(state.bookmarks, id);
    render();
  }

  function onEdit(id) {
    const bookmark = state.bookmarks.find((item) => item.id === id);
    if (!bookmark) return;

    state.editingId = id;
    render();

    container.querySelector('#title').value = bookmark.title;
    container.querySelector('#url').value = bookmark.url;
    container.querySelector('#tags').value = bookmark.tags.join(', ');
  }

  function allTags() {
    return [...new Set(state.bookmarks.flatMap((bookmark) => bookmark.tags))].sort();
  }

  function render() {
    const filtered = filterBookmarks(state.bookmarks, state.search, state.activeTag);
    const tags = allTags();

    container.innerHTML = `
      <section>
        <h1>Bookmark Manager</h1>
        <label for="search">Search</label>
        <input id="search" name="search" type="text" value="${escapeHtml(state.search)}" placeholder="Search by title or URL" />
        <div aria-label="Tag filters">
          <button type="button" data-tag="" ${state.activeTag === '' ? 'aria-pressed="true"' : ''}>All</button>
          ${tags
            .map(
              (tag) =>
                `<button type="button" data-tag="${escapeHtml(tag)}" ${state.activeTag === tag ? 'aria-pressed="true"' : ''}>${escapeHtml(tag)}</button>`
            )
            .join('')}
        </div>

        <form id="bookmark-form">
          <label for="title">Title</label>
          <input id="title" name="title" type="text" />
          ${state.errors.title ? `<p role="alert">${escapeHtml(state.errors.title)}</p>` : ''}

          <label for="url">URL</label>
          <input id="url" name="url" type="url" />
          ${state.errors.url ? `<p role="alert">${escapeHtml(state.errors.url)}</p>` : ''}

          <label for="tags">Tags</label>
          <input id="tags" name="tags" type="text" placeholder="comma,separated,tags" />

          <button type="submit">${state.editingId ? 'Save Bookmark' : 'Add Bookmark'}</button>
        </form>

        <ul aria-label="Bookmark list">
          ${filtered
            .map(
              (bookmark) => `
                <li>
                  <strong>${escapeHtml(bookmark.title)}</strong>
                  <a href="${escapeHtml(bookmark.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(bookmark.url)}</a>
                  <div>
                    ${bookmark.tags
                      .map(
                        (tag) =>
                          `<button type="button" aria-label="Filter by tag ${escapeHtml(tag)}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
                      )
                      .join(' ')}
                  </div>
                  <button type="button" data-edit="${bookmark.id}">Edit ${escapeHtml(bookmark.title)}</button>
                  <button type="button" data-delete="${bookmark.id}">Delete ${escapeHtml(bookmark.title)}</button>
                </li>
              `
            )
            .join('')}
        </ul>
      </section>
    `;

    container.querySelector('#search').addEventListener('input', (event) => {
      state.search = event.target.value;
      render();
    });

    container.querySelector('#bookmark-form').addEventListener('submit', onSubmit);

    container.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-delete');
        const title = state.bookmarks.find((item) => item.id === id)?.title || 'bookmark';
        onDelete(id, title);
      });
    });

    container.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', () => onEdit(button.getAttribute('data-edit')));
    });

    container.querySelectorAll('[data-tag]').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeTag = button.getAttribute('data-tag') || '';
        render();
      });
    });
  }

  return {
    get bookmarks() {
      return state.bookmarks;
    },
    render
  };
}
