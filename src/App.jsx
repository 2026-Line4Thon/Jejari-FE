import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import FindPage from './pages/find/FindPage';
import RegisterPage from './pages/register/RegisterPage';
import MyPage from './pages/mypage/MyPage';
import NotifyPage from './pages/notify/NotifyPage';
import SchoolAuthPage from './pages/auth/SchoolAuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LostItemFormPage from './pages/lost-item/LostItemFormPage';
import AiFeaturePage from './pages/ai-feature/AiFeaturePage';
import RegistrationCompletePage from './pages/complete/RegistrationCompletePage';
import SplashPage from './pages/splash/SplashPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/welcome" element={<HomePage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/login" element={<SchoolAuthPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/lost-item" element={<LostItemFormPage />} />
        <Route path="/ai-feature" element={<AiFeaturePage />} />
        <Route path="/complete" element={<RegistrationCompletePage />} />
        <Route path="*" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
