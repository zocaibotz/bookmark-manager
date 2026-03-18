import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { BookmarkDetailPage } from './pages/BookmarkDetailPage';
import { BookmarkListPage } from './pages/BookmarkListPage';

function HomePage() {
  return (
    <main>
      <h1>Bookmark Manager</h1>
      <p>Welcome to your bookmark workspace.</p>
      <nav>
        <Link to="/bookmarks">Go to bookmarks</Link>
      </nav>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bookmarks" element={<BookmarkListPage />} />
      <Route path="/bookmarks/:id" element={<BookmarkDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
