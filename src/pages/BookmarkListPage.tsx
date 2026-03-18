import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarkStore } from '../stores/bookmarkStore';

export function BookmarkListPage() {
  const { bookmarks, isLoading, error, loadBookmarks, clearError } = useBookmarkStore();

  useEffect(() => {
    void loadBookmarks();
  }, [loadBookmarks]);

  return (
    <main>
      <h1>Bookmarks</h1>
      {isLoading && <p>Loading bookmarks...</p>}
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <Link to={`/bookmarks/${bookmark.id}`}>{bookmark.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
