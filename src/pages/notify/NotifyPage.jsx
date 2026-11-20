import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemApiId, requestItemApi } from '../../services/foundItemService';
import './NotifyPage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import appLogo from '../../assets/dashboard-new/logo.svg';
import searchIcon from '../../assets/dashboard-new/lost-icon.svg';

export default function NotifyPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('전체');
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const requests = useRef(new Map());
  useEffect(() => {
    let active = true;
    const load = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('로그인 후 알림을 확인할 수 있어요.');
      const response = await fetch('https://miseno.store/notifications', { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || '알림을 불러오지 못했어요.');
      const items = Array.isArray(data) ? data : data?.notifications;
      if (!Array.isArray(items)) throw new Error('알림 목록 응답을 확인해 주세요.');
      if (active) setAlerts(items);
    };
    load().catch((failure) => { if (active) setError(failure.message); }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);
  const markAsRead = async (alert) => {
    if (alert.is_read) return Promise.resolve();
    if (!requests.current.has(alert.id)) {
      const operation = requestItemApi(`/notifications/${itemApiId(alert.id)}/read`, { method: 'PATCH' }).then((data) => {
        if (data?.is_read !== true) throw new Error('알림 읽음 처리 결과를 확인해 주세요.');
        setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, is_read: true } : item));
      }).finally(() => requests.current.delete(alert.id));
      requests.current.set(alert.id, operation);
    }
    return requests.current.get(alert.id);
  };
  const markAllAsRead = async () => {
    if (isReadingAll) return;
    setIsReadingAll(true);
    setError('');
    const results = await Promise.allSettled(alerts.filter((item) => !item.is_read).map(markAsRead));
    const failed = results.find((result) => result.status === 'rejected');
    if (failed) setError(failed.reason.message || '일부 알림을 읽음 처리하지 못했어요.');
    setIsReadingAll(false);
  };
  const visibleAlerts = alerts.filter((item) => filter === '전체' || (filter === '반환' ? ['CHAT_STARTED', 'RETURN_COMPLETED'].includes(item.type) : !['CHAT_STARTED', 'RETURN_COMPLETED'].includes(item.type)));
  return <main className="notify-page"><img src={pageBackground} alt=""/><header><button onClick={()=>navigate(-1)}><img src={backSurface} alt=""/><img src={backArrow} alt=""/></button><h1>알림</h1></header><section><div className="notification-toolbar"><nav><button type="button" className={filter==='전체'?'active':''} onClick={()=>setFilter('전체')}>전체</button><button type="button" onClick={markAllAsRead} disabled={isLoading || isReadingAll}>모두 읽음</button>{['매칭','반환'].map(item=><button type="button" className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</nav>
    {(error || isLoading || !visibleAlerts.length) && <p className="notification-feedback" role={error ? 'alert' : 'status'}>{error || (isLoading ? '알림을 불러오고 있어요.' : '알림이 없어요.')}</p>}</div>
    {visibleAlerts.map((alert) => {
      const i = alert.type === 'MATCH_CANDIDATE' ? 0 : ['CHAT_STARTED', 'RETURN_COMPLETED'].includes(alert.type) ? 1 : 2;
      const date = new Date(alert.created_at);
      const time = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
      const onRead = () => { setError(''); markAsRead(alert).catch((failure) => setError(failure.message)); };
      return <article className={`notification-card type-${i}${alert.is_read?'':' selected-card'}`} onClick={onRead} key={alert.id}><span className={`notify-icon n${i}`}>{i<2?<img src={appLogo} alt="제자리"/>:<img src={searchIcon} alt=""/>}</span><div><small>{i===0?'새 매칭':i===1?'반환':'매칭 중'}</small><strong>{alert.title}</strong><p>{alert.message}</p><b>{i===0?'상세 확인하기':i===1?'비공개 채팅 시작하기':'매칭 현황 확인하기'} ›</b></div><time>{time}</time></article>;
    })}</section></main>;
}
