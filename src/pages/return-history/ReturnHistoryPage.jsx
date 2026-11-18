import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import useApiResource from '../../hooks/useApiResource';
import { apiEnabled } from '../../api/config';
import { queryService } from '../../services/queryService';
import './ReturnHistoryPage.css';
import background from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import tumbler from '../../assets/return-history/item-1.png';
import umbrella from '../../assets/return-history/item-2.png';
import card from '../../assets/return-history/item-3.png';

const histories = [
  { image: tumbler, label: '찾았어요', tone: 'found', name: '텀블러', date: '3월 14일 반환 완료', place: '중앙도서관 1층 로비', method: '직접 전달 · 수령 확인 완료' },
  { image: card, label: '찾아줬어요', tone: 'returned', name: '체크카드', date: '3월 10일 반환 완료', place: '학생회관 2층 안내데스크', method: '보관소 전달 · 수령 확인 완료', blurred: true },
  { image: umbrella, label: '찾았어요', tone: 'found', name: '필통', date: '3월 3일 반환 완료', place: '공학관 A동 1층 입구', method: '직접 전달 · 수령 확인 완료' },
];

export default function ReturnHistoryPage() {
  const navigate = useNavigate();
  const history = useApiResource(useCallback((signal) => apiEnabled ? queryService.history(signal) : { total: histories.length, items: histories.map((item) => ({ ...item, id: item.name })) }, []));
  const entries = history.data?.items ?? [];
  const owned = entries.filter((item) => item.tone === 'found').length;
  return <main className="return-history-page">
    <img className="return-history-bg" src={background} alt="" />
    <header className="return-history-header">
      <button aria-label="마이페이지로 돌아가기" onClick={() => navigate('/mypage')}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>반환 완료 내역</h1>
    </header>
    <section className="return-history-content">
      <article className="return-summary"><span>다시 제자리를 찾은 물건</span><strong>총 {history.data?.total ?? '—'}건</strong><p role={history.error ? 'alert' : 'status'}>{history.error || (history.isLoading ? '반환 내역을 불러오고 있어요.' : `내가 찾은 물건 ${owned} · 찾아준 물건 ${entries.length - owned}`)}</p></article>
      <h2>전체 반환 내역</h2>
      {entries.map((history) => <article className="return-card" key={history.id}>
        <div className={`return-photo${history.blurred ? ' blurred' : ''}`}><img src={history.image} alt={history.name} />{history.blurred && <small>⌾ 민감정보 블러</small>}</div>
        <div className="return-card-main"><em className={history.tone}>{history.label}</em><strong>{history.name}</strong><span>{history.date}</span></div>
        <div className="return-card-bottom"><strong>{history.place}</strong><span>{history.method}</span></div>
      </article>)}
      <p className="return-note">완료된 반환 내역은 이 화면에서 모두 확인할 수 있어요.<br />반환이 끝난 물건은 자동 매칭 대상에서 제외돼요.</p>
    </section>
    <button className="return-home-button" onClick={() => navigate('/mypage')}>마이페이지로 이동</button>
  </main>;
}
