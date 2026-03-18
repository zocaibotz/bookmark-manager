import { create } from 'zustand';
import { ApiError } from '../services/apiClient';
import { bookmarkService } from '../services/bookmarkService';
import type { Bookmark } from '../types/bookmark';

interface BookmarkState {
  bookmarks: Bookmark[];
  selectedBookmark: Bookmark | null;
  isLoading: boolean;
  error: string | null;
  loadBookmarks: () => Promise<void>;
  loadBookmarkById: (id: string) => Promise<void>;
  clearError: () => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Unable to complete request.';
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarks: [],
  selectedBookmark: null,
  isLoading: false,
  error: null,
  loadBookmarks: async () => {
    set({ isLoading: true, error: null });

    try {
      const bookmarks = await bookmarkService.listBookmarks();
      set({ bookmarks, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  loadBookmarkById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const selectedBookmark = await bookmarkService.getBookmarkById(id);
      set({ selectedBookmark, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  clearError: () => set({ error: null }),
}));
