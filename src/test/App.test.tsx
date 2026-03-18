import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import * as bookmarkStore from '../stores/bookmarkStore';

describe('App routes', () => {
  it('renders bookmark list content for /bookmarks', async () => {
    vi.spyOn(bookmarkStore, 'useBookmarkStore').mockReturnValue({
      bookmarks: [{ id: '1', title: 'Docs', url: 'https://example.com', tags: ['work'] }],
      selectedBookmark: null,
      isLoading: false,
      error: null,
      loadBookmarks: vi.fn(),
      loadBookmarkById: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/bookmarks']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /bookmarks/i })).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });
});
