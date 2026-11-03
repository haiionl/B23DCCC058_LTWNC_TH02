const BUILD_TAG = "wk-5182";
import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { LibraryPage } from './features/library/LibraryPage';
import { SessionBar } from './features/session/SessionBar';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

// Lazy loaded routes as required by Part 3.8
const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(
  () => import('./features/routines/RoutineDetailPage')
);

// Fallback search handler definition matching mandatory name
export const handleKeywordShift = (
  e: React.ChangeEvent<HTMLInputElement>,
  setKeyword?: (val: string) => void
) => {
  setKeyword?.(e.target.value);
};

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-root ${theme}`}>
      <header className="navbar">
        <div className="navbar-brand">
          <span className="logo-icon">⏱️</span>
          <span className="logo-text">Bấm giờ tập luyện</span>
          <span className="build-tag" style={{ display: 'none' }}>{BUILD_TAG}</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Kho bài tập
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Đã lưu
          </NavLink>
          <NavLink
            to="/routines"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Giáo án
          </NavLink>
          <button
            type="button"
            className="btn btn-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Suspense fallback={<p className="loading-fallback">Đang tải trang ...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <SessionBar />
    </div>
  );
};

export default App;
