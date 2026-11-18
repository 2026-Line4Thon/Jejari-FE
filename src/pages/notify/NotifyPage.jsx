import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import { apiEnabled } from '../../api/config';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import './NotifyPage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import appLogo from '../../assets/dashboard-new/logo.svg';
import searchIcon from '../../assets/dashboard-new/lost-icon.svg';

export default function NotifyPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('전체');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const alerts = useNotifications();
  const items = alerts.items.filter((item) => filter === '전체' || (filter === '매칭' ? item.type.includes('MATCH') || item.type === 'WAITING' : item.type.includes('CHAT') || item.type.includes('RETURN')));
  const open = async (item) => {
    setSelectedAlert(item.id);
    if (!item.is_read && !(await alerts.mark([item.id]))) return;
    if (!apiEnabled || !item.target_id) return;
    if (item.type === 'MATCH_CANDIDATE') navigate(candidatePath(item.target_id));
    if (item.type === 'CHAT_STARTED') navigate(chatRoomPath(item.target_id));
  };
  return <main className="notify-page"><img src={pageBackground} alt="" />
    <header><button onClick={() => navigate(-1)}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button><h1>알림</h1></header>
    <section>
      <nav><button type="button" className={alerts.allRead ? 'active' : ''} onClick={alerts.markAll}>모두 읽음</button>{['전체', '매칭', '반환'].map((item) => <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</nav>
      {(alerts.error || alerts.isLoading || !items.length) && <p role={alerts.error ? 'alert' : 'status'}>{alerts.error || (alerts.isLoading ? '알림을 불러오고 있어요.' : '표시할 알림이 없어요.')}</p>}
      {items.map((item) => {
        const category = item.type === 'MATCH_CANDIDATE' ? 0 : item.type === 'CHAT_STARTED' ? 1 : 2;
        return <article className={`notification-card type-${category}${(selectedAlert ?? items[0]?.id) === item.id ? ' selected-card' : ''}`} onClick={() => open(item)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(item); } }} role="button" tabIndex={0} key={item.id}>
          <span className={`notify-icon n${category}`}>{category < 2 ? <img src={appLogo} alt="제자리" /> : <img src={searchIcon} alt="" />}</span>
          <div><small>{category === 0 ? '새 매칭' : category === 1 ? '소유권 확인' : '매칭 중'}</small><strong>{item.title}</strong><p>{item.message}</p><b>{category === 0 ? '상세 확인하기' : category === 1 ? '비공개 채팅 시작하기' : '매칭 현황 확인하기'} ›</b></div><time>{item.time}</time>
        </article>;
      })}
    </section>
  </main>;
}
