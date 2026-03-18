import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookmarkStore } from '../stores/bookmarkStore';

const resetStore = () => {
  useBookmarkStore.setState({
    bookmarks: [],
    selectedBookmark: null,
    isLoading: false,
    error: null,
  });
};

describe('bookmark store', () => {
  beforeEach(() => {
    resetStore();
    vi.restoreAllMocks();
  });

  it('loads bookmarks into state', async () => {
    const bookmarks = [{ id: '1', title: 'Docs', url: 'https://example.com', tags: ['work'] }];
    const { bookmarkService } = await import('../services/bookmarkService');
    vi.spyOn(bookmarkService, 'listBookmarks').mockResolvedValue(bookmarks);

    await useBookmarkStore.getState().loadBookmarks();

    expect(useBookmarkStore.getState().bookmarks).toEqual(bookmarks);
    expect(useBookmarkStore.getState().error).toBeNull();
  });
});
