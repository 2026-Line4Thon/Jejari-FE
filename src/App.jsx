import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import FindPage from './pages/find/FindPage';
import RegisterPage from './pages/register/RegisterPage';
import MyPage from './pages/mypage/MyPage';
import NotifyPage from './pages/notify/NotifyPage';

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '20px',
        }}
      >
        <Link to="/">홈</Link>
        <Link to="/find">잃어버렸어요</Link>
        <Link to="/register">주웠어요</Link>
        <Link to="/mypage">마이</Link>
        <Link to="/notify">알림</Link>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find" element={<FindPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/notify" element={<NotifyPage />} />
          <Route path="*" element={<h1>없는 페이지입니다</h1>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;