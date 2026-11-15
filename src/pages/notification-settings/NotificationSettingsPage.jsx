import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationSettingsPage.css';
import background from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';

const primarySettings = [
  ['AI 매칭 알림', '비슷한 습득물을 찾으면 알려드려요.'],
  ['채팅 알림', '새로운 비공개 메시지를 알려드려요.'],
  ['반환 진행 알림', '소유권 확인과 반환 완료 소식을 받아요.'],
];

function SettingRow({ title, description, index, enabled, onToggle, divided = false }) {
  return <div className={`notification-row${divided ? ' divided' : ''}`}><div><strong>{title}</strong><span>{description}</span></div><button className={enabled ? 'enabled' : ''} aria-label={`${title} ${enabled ? '끄기' : '켜기'}`} onClick={() => onToggle(index)}><i /></button></div>;
}

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState([true, true, true, false]);
  const toggle = (index) => setEnabled((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  return <main className="notification-settings-page">
    <img className="notification-settings-bg" src={background} alt="" />
    <header className="notification-settings-header"><button aria-label="마이페이지로 돌아가기" onClick={() => navigate('/mypage')}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button><h1>알림 설정</h1></header>
    <section className="notification-settings-content">
      <article className="notification-intro"><strong>필요한 소식만 받아보세요</strong><span>설정은 변경 즉시 적용돼요.</span></article>
      <h2>분실물 · 반환 알림</h2>
      <article className="notification-group">{primarySettings.map(([title, description], index) => <SettingRow key={title} title={title} description={description} index={index} enabled={enabled[index]} onToggle={toggle} divided={index > 0} />)}</article>
      <h2>선택 알림</h2>
      <article className="notification-group optional"><SettingRow title="공지사항 알림" description="서비스 변경과 점검 소식을 받아요." index={3} enabled={enabled[3]} onToggle={toggle} /></article>
      <p className="notification-help">알림이 오지 않는다면 기기의 설정에서<br />Jejari 알림 허용 여부를 확인해 주세요.</p>
    </section>
    <button className="notification-home-button" onClick={() => navigate('/mypage')}>마이페이지로 이동</button>
  </main>;
}
