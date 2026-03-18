function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function normalizeTags(tagsInput = '') {
  if (Array.isArray(tagsInput)) {
    return [...new Set(tagsInput.map((tag) => tag.trim()).filter(Boolean))];
  }

  return [...new Set(String(tagsInput)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean))];
}

export function validateBookmark(bookmark = {}) {
  const errors = {};

  if (!bookmark.title || !bookmark.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!bookmark.url || !bookmark.url.trim()) {
    errors.url = 'Please enter a valid URL (http/https)';
  } else if (!isValidUrl(bookmark.url.trim())) {
    errors.url = 'Please enter a valid URL (http/https)';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function filterBookmarks(bookmarks = [], search = '', activeTag = '') {
  const q = search.trim().toLowerCase();

  return bookmarks.filter((bookmark) => {
    const titleMatch = bookmark.title.toLowerCase().includes(q);
    const urlMatch = bookmark.url.toLowerCase().includes(q);
    const searchMatch = !q || titleMatch || urlMatch;
    const tagMatch = !activeTag || bookmark.tags.includes(activeTag);
    return searchMatch && tagMatch;
  });
}

export function addBookmark(bookmarks = [], bookmark) {
  return [...bookmarks, bookmark];
}

export function editBookmark(bookmarks = [], id, updates = {}) {
  return bookmarks.map((bookmark) =>
    bookmark.id === id
      ? {
          ...bookmark,
          ...updates,
          tags: updates.tags ? normalizeTags(updates.tags) : bookmark.tags
        }
      : bookmark
  );
}

export function deleteBookmark(bookmarks = [], id) {
  return bookmarks.filter((bookmark) => bookmark.id !== id);
}
