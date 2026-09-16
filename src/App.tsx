import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AboutPage } from './ui/pages/AboutPage';
import { AskPage } from './ui/pages/AskPage';
import { CalmPage } from './ui/pages/CalmPage';
import { CastPage } from './ui/pages/CastPage';
import { HomePage } from './ui/pages/HomePage';
import { ReadingPage } from './ui/pages/ReadingPage';
import { RecordsPage } from './ui/pages/RecordsPage';

// 只用 HashRouter：Capacitor 从 file:// 加载，BrowserRouter 会失效
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/calm" element={<CalmPage />} />
        <Route path="/cast" element={<CastPage />} />
        <Route path="/r/:id" element={<ReadingPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
