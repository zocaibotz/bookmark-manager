import { apiRequest } from './apiClient';
import type { Bookmark } from '../types/bookmark';

export const bookmarkService = {
  listBookmarks: () => apiRequest<Bookmark[]>('/bookmarks'),
  getBookmarkById: (id: string) => apiRequest<Bookmark>(`/bookmarks/${id}`),
};
