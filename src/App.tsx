import { HashRouter, Route, Routes } from 'react-router-dom';

// 只用 HashRouter：Capacitor 从 file:// 加载，BrowserRouter 会失效
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Placeholder />} />
      </Routes>
    </HashRouter>
  );
}

function Placeholder() {
  return (
    <main className="placeholder">
      <h1>摇卦</h1>
      <p>界面建设中</p>
    </main>
  );
}
