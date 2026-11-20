import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMyRegistrations from '../../hooks/useMyRegistrations';
import { getRegistrationBadge } from '../../utils/myRegistrationNavigation';
import './MyPage.css';
import background from '../../assets/dashboard-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import profileSurface from '../../assets/mypage/profile-surface.svg';
import profileIcon from '../../assets/mypage/profile-icon.svg';
import schoolBadge from '../../assets/mypage/school-badge.svg';
import schoolShield from '../../assets/mypage/school-shield.svg';

export default function MyPage() {
  const navigate = useNavigate();
  const registrations = useMyRegistrations();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [profile, setProfile] = useState({ nickname: '', email: '', isUniversityVerified: null });
  const [profileError, setProfileError] = useState('');
  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 내 정보를 확인할 수 있어요.');

        const response = await fetch('https://miseno.store/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || '내 정보를 불러오지 못했어요.');
        if (active) {
          setProfile({
            nickname: data.nickname || '이름 없음',
            email: data.email || '',
            isUniversityVerified: Boolean(data.is_university_verified),
          });
        }
      } catch (loadError) {
        if (active) setProfileError(loadError.message || '내 정보를 불러오지 못했어요.');
      }
    };
    loadProfile();
    return () => { active = false; };
  }, []);
  const openRegistration = async (itemId) => {
    const destination = await registrations.open(itemId);
    if (destination) navigate(destination.to, { state: destination.state });
  };
  const logout = async () => {
    if (isLoggingOut) return;

    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!accessToken || !refreshToken) {
      setLogoutMessage('로그인 토큰이 없습니다. 다시 로그인해 주세요.');
      return;
    }

    setIsLoggingOut(true);
    setLogoutMessage('');
    try {
      const response = await fetch('https://miseno.store/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || '로그아웃에 실패했습니다.');
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutMessage(error.message || '로그아웃에 실패했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  return <main className="my-page">
    <img src={background} alt="" />
    <header>
      <button type="button" aria-label="뒤로 가기" onClick={() => navigate('/home')}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>마이페이지</h1>
    </header>
    <section>
      <article className="my-profile">
        <i><img src={profileSurface} alt="" /><img src={profileIcon} alt="프로필" /></i>
        <div><strong>{profile.nickname || '내 정보'}</strong><span>{profile.email}</span><em><img src={schoolBadge} alt="" /><b><img src={schoolShield} alt="" />{profile.isUniversityVerified === null ? '학교 인증 확인 중' : profile.isUniversityVerified ? '학교 인증 완료' : '학교 인증 필요'}</b></em></div>
      </article>
      {profileError && <p className="my-registration-feedback" role="alert">{profileError}</p>}
      <article className="my-stats"><div><b>{registrations.stats?.lost ?? '—'}</b><span>분실물</span></div><div><b>{registrations.stats?.found ?? '—'}</b><span>습득물</span></div><div><b>{registrations.stats?.completed ?? '—'}</b><span>반환 완료</span></div></article>
      {registrations.statsError && <p className="my-registration-feedback" role="alert">{registrations.statsError}</p>}
      <h2>진행 중인 등록</h2>
      {registrations.isLoading && <p className="my-registration-feedback" role="status">등록 내역을 불러오고 있어요.</p>}
      {registrations.error && <p className="my-registration-feedback" role="alert">{registrations.error}</p>}
      {!registrations.isLoading && !registrations.error && !registrations.items.length && <p className="my-registration-feedback">진행 중인 등록이 없어요.</p>}
      {registrations.items.map((item) => {
        const badge = getRegistrationBadge(item);
        return <button type="button" className="my-item" key={item.id} onClick={() => openRegistration(item.id)} disabled={registrations.pendingId !== null} aria-busy={registrations.pendingId === item.id}>
          <span className={'my-item-photo is-' + item.photo.variant}><img src={item.photo.source} alt="" /></span>
          <div><em className={badge.className}>{badge.label}</em><strong>{item.name}</strong><small>{item.type === 'lost' ? '분실' : '습득'} · {item.place}</small></div>
          <b aria-hidden="true">›</b>
        </button>;
      })}
      <nav className="my-menu">
        <button onClick={() => navigate('/return-history')}><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg></i>반환 완료 내역 <b>›</b></button>
        <button onClick={() => navigate('/notification-settings')}><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg></i>알림 설정 <b>›</b></button>
        <button onClick={() => navigate('/privacy-security')}><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.7-3 8.2-7 10-4-1.8-7-5.3-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg></i>개인정보 및 보안 <b>›</b></button>
        <button className="logout" type="button" onClick={logout} disabled={isLoggingOut}>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</button>
      </nav>
      {logoutMessage && <p className="my-registration-feedback" role="alert">{logoutMessage}</p>}
    </section>
  </main>;
}
