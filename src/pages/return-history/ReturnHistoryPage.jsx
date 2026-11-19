import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnHistoryPage.css';
import background from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';

function formatCompletedAt(value) {
  if (!value) return '반환 완료';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '반환 완료';
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(date) + ' 반환 완료';
}

function isFinder(role) {
  return String(role || '').toLowerCase().includes('found');
}

export default function ReturnHistoryPage() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const loadHistories = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 반환 완료 내역을 확인할 수 있어요.');
        const response = await fetch('https://miseno.store/users/me/history', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || '반환 완료 내역을 불러오지 못했어요.');
        if (active) setHistories(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (active) setError(loadError.message || '반환 완료 내역을 불러오지 못했어요.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadHistories();
    return () => { active = false; };
  }, []);
  const foundCount = histories.filter((history) => isFinder(history.role)).length;
  return <main className="return-history-page">
    <img className="return-history-bg" src={background} alt="" />
    <header className="return-history-header">
      <button aria-label="마이페이지로 돌아가기" onClick={() => navigate('/mypage')}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>반환 완료 내역</h1>
    </header>
    <section className="return-history-content">
      <article className="return-summary"><span>다시 제자리를 찾은 물건</span><strong>총 {histories.length}건</strong><p>내가 찾은 물건 {histories.length - foundCount} · 찾아준 물건 {foundCount}</p></article>
      <h2>전체 반환 내역</h2>
      {isLoading && <p className="return-note" role="status">반환 완료 내역을 불러오고 있어요.</p>}
      {error && <p className="return-note" role="alert">{error}</p>}
      {!isLoading && !error && !histories.length && <p className="return-note">반환 완료 내역이 없어요.</p>}
      {histories.map((history) => {
        const finder = isFinder(history.role);
        return <article className="return-card" key={history.chat_room_id}>
          <div className="return-photo blurred"><img src={history.blurred_image_url} alt={history.item_name} /><small>⌾ 민감정보 블러</small></div>
          <div className="return-card-main"><em className={finder ? 'returned' : 'found'}>{finder ? '찾아줬어요' : '찾았어요'}</em><strong>{history.item_name}</strong><span>{formatCompletedAt(history.completed_at)}</span></div>
          <div className="return-card-bottom"><strong>반환 완료</strong><span>{history.status || '수령 확인 완료'}</span></div>
        </article>;
      })}
      <p className="return-note">완료된 반환 내역은 이 화면에서 모두 확인할 수 있어요.<br />반환이 끝난 물건은 자동 매칭 대상에서 제외돼요.</p>
    </section>
    <button className="return-home-button" onClick={() => navigate('/mypage')}>마이페이지로 이동</button>
  </main>;
}
