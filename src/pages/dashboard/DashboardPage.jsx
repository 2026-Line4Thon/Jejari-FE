import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import background from '../../assets/dashboard-new/background.svg';
import headerSurface from '../../assets/dashboard-new/header.svg';
import logo from '../../assets/dashboard-new/logo.svg';
import bell from '../../assets/dashboard-new/bell.svg';
import lostCard from '../../assets/dashboard-new/lost-card.svg';
import foundCard from '../../assets/dashboard-new/found-card.svg';
import actionIcon from '../../assets/dashboard-new/action-icon.svg';
import lostIcon from '../../assets/dashboard-new/lost-icon.svg';
import foundIcon from '../../assets/dashboard-new/found-icon.svg';
import arrow from '../../assets/dashboard-new/arrow.svg';
import statusCard from '../../assets/dashboard-new/status-card.svg';
import pulse from '../../assets/dashboard-new/pulse.svg';
import count from '../../assets/dashboard-new/count.svg';
import placeholder from '../../assets/dashboard-new/placeholder.svg';
import badge from '../../assets/dashboard-new/badge.svg';
import badgeIcon from '../../assets/dashboard-new/badge-icon.svg';
import safety from '../../assets/dashboard-new/safety.svg';
import safetyIcon from '../../assets/dashboard-new/safety-icon.svg';
import navSurface from '../../assets/dashboard-new/nav.svg';
import navHome from '../../assets/home-nav/home-active.svg';
import navChat from '../../assets/home-nav/chat.svg';
import navMy from '../../assets/home-nav/my.svg';
import photoOne from '../../assets/dashboard-new/photo-1.png';
import photoTwo from '../../assets/dashboard-new/photo-2.png';
import photoThree from '../../assets/dashboard-new/photo-3.png';

const defaultItems = [
  { name: '텀블러', place: '중앙도서관 1층', image: photoOne },
  { name: '카드지갑', place: '학생회관 2층', image: photoTwo, private: true },
  { name: '카키색 우산', place: '공학관 A동', image: photoThree },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const myMatchingCount = 3;
  const items = defaultItems;

  useEffect(() => {
    const loadHome = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        const response = await fetch('https://miseno.store/home', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('홈 정보를 불러오지 못했습니다.');
      } catch {
        // 홈 접근 확인 요청이 실패해도 기존 홈 화면은 유지합니다.
      }
    };
    loadHome();
  }, []);

  return (
    <main className="new-dashboard-page" aria-label="홈">
      <img className="dashboard-background" src={background} alt="" />
      <header className="new-dashboard-header">
        <img className="header-surface" src={headerSurface} alt="" />
        <img className="dashboard-logo" src={logo} alt="제자리" />
        <button type="button" aria-label="알림" onClick={() => navigate('/notify')}><img src={bell} alt="" /></button>
      </header>

      <section className="dashboard-main-content">
        <p className="dashboard-greeting">안녕하세요, 멋사님</p>
        <h1>무엇을 도와드릴까요?</h1>

        <div className="quick-actions">
          <button className="quick-action lost-action" type="button" onClick={() => navigate('/register')}>
            <img className="action-card-surface" src={lostCard} alt="" />
            <img className="action-icon-surface" src={actionIcon} alt="" />
            <img className="action-symbol" src={lostIcon} alt="" />
            <strong>물건을<br />잃어버렸어요</strong><small>사진 또는 설명으로 찾기</small><img className="action-arrow" src={arrow} alt="" />
          </button>
          <button className="quick-action found-action" type="button" onClick={() => navigate('/found-item')}>
            <img className="action-card-surface" src={foundCard} alt="" />
            <img className="action-icon-surface" src={actionIcon} alt="" />
            <img className="action-symbol" src={foundIcon} alt="" />
            <strong>물건을<br />주웠어요</strong><small>사진으로 빠르게 등록하기</small><img className="action-arrow" src={arrow} alt="" />
          </button>
        </div>

        <Link className="matching-status" to="/matches">
          <img className="status-surface" src={statusCard} alt="" />
          <div className="status-copy">
            <div><img className="status-pulse" src={pulse} alt="" /><strong>내 매칭 현황</strong></div>
            <p>내 매칭 후보를 확인해 보세요</p>
          </div>
          <img className="match-count" src={count} alt="" /><b>{myMatchingCount}건</b>
        </Link>

        <section className="recent-items" aria-labelledby="recent-title">
          <div className="recent-heading"><h2 id="recent-title">최근 등록된 분실물</h2><button type="button" onClick={() => navigate('/find')}>전체보기</button></div>
          <div className="item-grid">
            {items.map((item) => (
              <article className="recent-item" key={item.id || item.name}>
                <div className="recent-photo">
                  <img className="placeholder" src={placeholder} alt="" />
                  <img className={item.private ? 'item-photo is-private' : 'item-photo'} src={item.image} alt="" />
                  {item.private && <span className="privacy-badge"><img src={badge} alt="" /><em>민감정보 블러</em><img src={badgeIcon} alt="" /></span>}
                </div>
                <strong>{item.name}</strong><small>{item.place}</small>
              </article>
            ))}
          </div>
        </section>

        <aside className="dashboard-safety"><img className="safety-surface" src={safety} alt="" /><img className="safety-icon" src={safetyIcon} alt="" /><strong>안심하고 이용하세요</strong><p>연락처 공개 없이 앱 안에서 반환할 수 있어요.</p></aside>
      </section>

      <nav className="new-bottom-navigation" aria-label="주 메뉴">
        <img className="nav-surface" src={navSurface} alt="" />
        <a className="active" href="/home"><img src={navHome} alt="" /><span>홈</span></a>
        <button type="button" aria-label="채팅" onClick={() => navigate('/chats')}><img src={navChat} alt="" /><span>채팅</span></button>
        <a href="/mypage"><img src={navMy} alt="" /><span>마이</span></a>
      </nav>
    </main>
  );
}
