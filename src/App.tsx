import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import { AboutPage } from './ui/pages/AboutPage';
import { AskPage } from './ui/pages/AskPage';
import { CalmPage } from './ui/pages/CalmPage';
import { CastPage } from './ui/pages/CastPage';
import { DataPage } from './ui/pages/DataPage';
import { HomePage } from './ui/pages/HomePage';
import { MeihuaAskPage } from './ui/pages/MeihuaAskPage';
import { MeihuaReadingPage } from './ui/pages/MeihuaReadingPage';
import { ReadingPage } from './ui/pages/ReadingPage';
import { RecordsPage } from './ui/pages/RecordsPage';

// 只用 HashRouter：Capacitor 从 file:// 加载，BrowserRouter 会失效
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/calm" element={<CalmPage />} />
          <Route path="/cast" element={<CastPage />} />
          <Route path="/r/:id" element={<ReadingPage />} />
          <Route path="/meihua" element={<MeihuaAskPage />} />
          <Route path="/m/:id" element={<MeihuaReadingPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
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
