import { describe, it, expect } from 'vitest';
import {
  validateBookmark,
  filterBookmarks,
  addBookmark,
  editBookmark,
  deleteBookmark
} from '../src/bookmarks.js';

describe('bookmark domain', () => {
  it('validates required title and valid URL', () => {
    const bad = validateBookmark({ title: '', url: 'foo' });
    expect(bad.valid).toBe(false);
    expect(bad.errors.title).toBeTruthy();
    expect(bad.errors.url).toBeTruthy();

    const good = validateBookmark({ title: 'Docs', url: 'https://example.com' });
    expect(good.valid).toBe(true);
  });

  it('filters by title or URL search text and tag', () => {
    const bookmarks = [
      { id: '1', title: 'OpenAI', url: 'https://openai.com', tags: ['ai'] },
      { id: '2', title: 'MDN', url: 'https://developer.mozilla.org', tags: ['docs', 'web'] }
    ];

    expect(filterBookmarks(bookmarks, 'open', '')).toHaveLength(1);
    expect(filterBookmarks(bookmarks, 'mozilla', '')).toHaveLength(1);
    expect(filterBookmarks(bookmarks, '', 'docs')).toHaveLength(1);
  });

  it('adds, edits, and deletes bookmarks by id', () => {
    const base = [{ id: '1', title: 'A', url: 'https://a.com', tags: ['x'] }];
    const added = addBookmark(base, { id: '2', title: 'B', url: 'https://b.com', tags: ['y'] });
    expect(added).toHaveLength(2);

    const edited = editBookmark(added, '2', { title: 'B2', url: 'https://b2.com', tags: ['z'] });
    expect(edited.find((b) => b.id === '2').title).toBe('B2');

    const removed = deleteBookmark(edited, '1');
    expect(removed.map((b) => b.id)).toEqual(['2']);
  });
});
