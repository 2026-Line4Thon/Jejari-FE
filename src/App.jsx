import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import FindPage from './pages/find/FindPage';
import FoundItemDetailPage from './pages/find/FoundItemDetailPage';
import RegisterPage from './pages/register/RegisterPage';
import MyPage from './pages/mypage/MyPage';
import NotifyPage from './pages/notify/NotifyPage';
import SchoolAuthPage from './pages/auth/SchoolAuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LostItemFormPage from './pages/lost-item/LostItemFormPage';
import AiFeaturePage from './pages/ai-feature/AiFeaturePage';
import RegistrationCompletePage from './pages/complete/RegistrationCompletePage';
import ReturnHistoryPage from './pages/return-history/ReturnHistoryPage';
import NotificationSettingsPage from './pages/notification-settings/NotificationSettingsPage';
import PrivacySecurityPage from './pages/privacy-security/PrivacySecurityPage';
import SplashPage from './pages/splash/SplashPage';
import FoundAnalysisPage from './pages/found-analysis/FoundAnalysisPage';
import FoundItemRegistrationPage from './pages/found-item/FoundItemRegistrationPage';
import FoundAnalyzingPage from './pages/found-analyzing/FoundAnalyzingPage';
import FoundRegistrationCompletePage from './pages/found-complete/FoundRegistrationCompletePage';
import MatchingCandidatesPage from './pages/matches/MatchingCandidatesPage';
import MatchingRegistrationsPage from './pages/matches/MatchingRegistrationsPage';
import MatchingCandidateDetailPage from './pages/matches/MatchingCandidateDetailPage';
import OwnershipCheckPage from './pages/ownership/OwnershipCheckPage';
import ReturnConnectionPage from './pages/return-connection/ReturnConnectionPage';

import ChatListPage from './pages/chats/ChatListPage';
import ChatRoomPage from './pages/chats/ChatRoomPage';
import ChatReturnCompletePage from './pages/chats/ChatReturnCompletePage';
import FoundMatchingResultsPage from './pages/found-matches/FoundMatchingResultsPage';
import FoundMatchingCandidatePage from './pages/found-matches/FoundMatchingCandidatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/welcome" element={<HomePage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/found-items/:itemId" element={<FoundItemDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/login" element={<SchoolAuthPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/lost-item" element={<LostItemFormPage />} />
        <Route path="/found-analysis" element={<FoundAnalysisPage />} />
        <Route path="/found-item" element={<FoundItemRegistrationPage />} />
        <Route path="/found-analyzing" element={<FoundAnalyzingPage />} />
        <Route path="/found-complete" element={<FoundRegistrationCompletePage />} />
        <Route path="/found-matches" element={<FoundMatchingResultsPage />} />
        <Route path="/found-matches/:candidateId" element={<FoundMatchingCandidatePage />} />
        <Route path="/chats" element={<ChatListPage />} />
        <Route path="/chats/:roomId" element={<ChatRoomPage />} />
        <Route path="/chats/:roomId/complete" element={<ChatReturnCompletePage />} />
        <Route path="/matches" element={<MatchingCandidatesPage />} />
        <Route path="/my-matches" element={<MatchingRegistrationsPage />} />
        <Route path="/matches/:candidateId" element={<MatchingCandidateDetailPage />} />
        <Route path="/matches/:candidateId/ownership" element={<OwnershipCheckPage />} />
        <Route path="/matches/:candidateId/return" element={<ReturnConnectionPage />} />
        <Route path="/ai-feature" element={<AiFeaturePage />} />
        <Route path="/complete" element={<RegistrationCompletePage />} />
        <Route path="/return-history" element={<ReturnHistoryPage />} />
        <Route path="/notification-settings" element={<NotificationSettingsPage />} />
        <Route path="/privacy-security" element={<PrivacySecurityPage />} />
        <Route path="*" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
