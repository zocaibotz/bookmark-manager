import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBookmarkStore } from '../stores/bookmarkStore';

export function BookmarkDetailPage() {
  const { id = '' } = useParams();
  const { selectedBookmark, isLoading, error, loadBookmarkById, clearError } = useBookmarkStore();

  useEffect(() => {
    if (id) {
      void loadBookmarkById(id);
    }
  }, [id, loadBookmarkById]);

  return (
    <main>
      <h1>Bookmark Detail</h1>
      <p>
        <Link to="/bookmarks">Back to list</Link>
      </p>
      {isLoading && <p>Loading bookmark...</p>}
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}
      {selectedBookmark && (
        <article>
          <h2>{selectedBookmark.title}</h2>
          <p>
            <a href={selectedBookmark.url} target="_blank" rel="noreferrer">
              {selectedBookmark.url}
            </a>
          </p>
          <p>{selectedBookmark.description ?? 'No description available.'}</p>
        </article>
      )}
    </main>
  );
}
