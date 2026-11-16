import { useNavigate } from 'react-router-dom';
import useMyRegistrations from '../../hooks/useMyRegistrations';
import { getRegistrationBadge } from '../../utils/myRegistrationNavigation';
import './MyPage.css';
import background from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import profileSurface from '../../assets/mypage/profile-surface.svg';
import profileIcon from '../../assets/mypage/profile-icon.svg';
import schoolBadge from '../../assets/mypage/school-badge.svg';
import schoolShield from '../../assets/mypage/school-shield.svg';

export default function MyPage() {
  const navigate = useNavigate();
  const registrations = useMyRegistrations();
  const openRegistration = async (itemId) => {
    const destination = await registrations.open(itemId);
    if (destination) navigate(destination.to, { state: destination.state });
  };
  return <main className="my-page">
    <img src={background} alt="" />
    <header>
      <button type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>마이페이지</h1>
    </header>
    <section>
      <article className="my-profile">
        <i><img src={profileSurface} alt="" /><img src={profileIcon} alt="프로필" /></i>
        <div><strong>김멋사</strong><span>minji@univ.ac.kr</span><em><img src={schoolBadge} alt="" /><b><img src={schoolShield} alt="" />학교 인증 완료</b></em></div>
      </article>
      <article className="my-stats"><div><b>2</b><span>분실물</span></div><div><b>1</b><span>습득물</span></div><div><b>3</b><span>반환 완료</span></div></article>
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
        <button className="logout">로그아웃</button>
      </nav>
    </section>
  </main>;
}
