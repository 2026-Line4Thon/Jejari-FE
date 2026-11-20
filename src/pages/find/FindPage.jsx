import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPage.css';
import pageBackground from '../../assets/login/login-bg.svg';
import introSurface from '../../assets/recent-found/intro.svg';
import cardSurface from '../../assets/recent-found/card.svg';
import placeholder from '../../assets/recent-found/placeholder.svg';
import pin from '../../assets/recent-found/pin.svg';
import clock from '../../assets/recent-found/clock.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import foundBadge from '../../assets/recent-found/found-badge.svg';
import lostBadge from '../../assets/recent-found/lost-badge.svg';
import privacyBadge from '../../assets/recent-found/privacy-badge.svg';
import privacyIcon from '../../assets/recent-found/privacy-icon.svg';
import arrow from '../../assets/dashboard-new/arrow.svg';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { foundItemDetailPath } from '../../utils/foundItemNavigation';

export default function FindPage() {
  const navigate = useNavigate();
  const [foundItems, setFoundItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('로그인 후 목록을 확인할 수 있어요.');
      const response = await fetch('https://miseno.store/items/found', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) throw new Error(data?.detail || '습득물 목록을 불러오지 못했어요.');
      const items = data == null ? [] : Array.isArray(data) ? data : data.items;
      if (!Array.isArray(items)) throw new Error('습득물 목록 응답을 확인해 주세요.');
      if (active) setFoundItems(items.map((item) => {
        const date = new Date(item.created_at || item.found_at);
        return { id: item.found_item_id ?? item.id, name: item.item_name || '습득물', place: item.found_location || item.place_name || '', date: Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date), image: item.blurred_image_url || item.image_url || placeholder, status: 'found', private: item.is_blurred === true };
      }));
    };
    load().catch((failure) => { if (active) setError(failure.message); }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="recent-found-page" aria-labelledby="recent-found-title">
      <img className="recent-found-background" src={pageBackground} alt="" />
      <header className="recent-found-header">
        <button type="button" onClick={() => navigate('/home')} aria-label="이전 화면"><img className="back-surface" src={backSurface} alt="" /><img className="back-arrow" src={backArrow} alt="" /></button>
        <h1 id="recent-found-title">최근 등록된 분실물</h1>
      </header>
      <section className="recent-found-content">
        <aside className="recent-found-intro"><img src={introSurface} alt="" /><div className="recent-found-intro-copy"><strong>우리 학교에 최근 등록된 물건이에요</strong><p role={error ? 'alert' : 'status'}>{error || (isLoading ? '습득물 목록을 불러오고 있어요.' : !foundItems.length ? '아직 등록된 습득물이 없어요.' : '물건을 선택하면 습득 장소와 특징을 확인할 수 있어요.')}</p></div></aside>
        <div className="found-list">
          {foundItems.map((item) => (
            <button className="found-item-card" type="button" key={item.id} onClick={() => navigate(foundItemDetailPath(item.id), { state: { returnTo: '/find' } })}>
              <img className="found-card-surface" src={cardSurface} alt="" />
              <div className="found-photo"><img src={placeholder} alt="" /><img className={item.private ? 'found-photo-image is-private' : 'found-photo-image'} src={item.image} alt="" />{item.private && <span className="found-privacy-badge"><img src={privacyBadge} alt="" /><img src={privacyIcon} alt="" /><em>민감정보 블러</em></span>}</div>
              <div className="found-item-copy"><span className={`found-badge ${item.status}`}><img src={item.status === 'found' ? foundBadge : lostBadge} alt="" />{item.status === 'found' ? '주웠어요' : '잃어버렸어요'}</span><strong>{item.name}</strong><span><img src={pin} alt="" />{item.place}</span><span><img src={clock} alt="" />{item.date}</span></div>
              <img className="found-arrow" src={arrow} alt="" />
            </button>
          ))}
        </div>
      </section>
      <BottomNavigation />
    </main>
  );
}
