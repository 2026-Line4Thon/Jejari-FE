import { useEffect, useState } from 'react';
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
import BottomNavigation from '../../components/navigation/BottomNavigation';

function getImageUrl(url) {
  if (!url) return placeholder;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://miseno.store${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [error, setError] = useState('');
  const myMatchingCount = home?.count ?? '—';
  const items = home?.items || [];

  useEffect(() => {
    let active = true;
    const loadHome = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 홈 정보를 확인할 수 있어요.');
        const response = await fetch('https://miseno.store/home', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('홈 정보를 불러오지 못했습니다.');
        const data = await response.json();
        if (!Array.isArray(data?.recent_found_items) || !Number.isInteger(data.my_matching_count) || data.my_matching_count < 0) throw new Error('홈 정보 응답을 확인해 주세요.');
        const recent = data.recent_found_items.slice(0, 3).map((item) => ({ id: item.id, name: item.item_name || '습득물', place: item.found_location || '', image: getImageUrl(item.blurred_image_url), private: item.is_blurred === true }));
        if (active) setHome({ count: data.my_matching_count, items: recent });
      } catch (failure) { if (active) setError(failure.message); }
    };
    loadHome();
    return () => { active = false; };
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
        <p className="dashboard-greeting">안녕하세요</p>
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
          {(error || !items.length) && <p role={error ? 'alert' : 'status'}>{error || (!home ? '등록된 물건을 불러오고 있어요.' : '아직 등록된 물건이 없어요.')}</p>}
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

      <BottomNavigation />
    </main>
  );
}
