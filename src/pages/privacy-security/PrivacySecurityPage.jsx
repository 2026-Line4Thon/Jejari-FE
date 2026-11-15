import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacySecurityPage.css';
import background from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';

function ToggleRow({ title, description, enabled, onToggle, divided }) { return <div className={`privacy-toggle-row${divided ? ' divided' : ''}`}><div><strong>{title}</strong><span>{description}</span></div><button className={enabled ? 'enabled' : ''} onClick={onToggle} aria-label={`${title} ${enabled ? '끄기' : '켜기'}`}><i /></button></div>; }

export default function PrivacySecurityPage() {
  const navigate = useNavigate();
  const [security, setSecurity] = useState([true, true]);
  return <main className="privacy-page"><img className="privacy-bg" src={background} alt="" /><header className="privacy-header"><button aria-label="마이페이지로 돌아가기" onClick={() => navigate('/mypage')}><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button><h1>개인정보 및 보안</h1></header><section className="privacy-content"><h2>내 계정 정보</h2><article className="account-card"><span>이름</span><strong>김멋사</strong><span>학교 이메일</span><strong>minji@univ.ac.kr</strong><span>인증 상태</span><em>학교 인증 완료</em></article><h2>보안 설정</h2><article className="privacy-security-card"><ToggleRow title="새 기기 로그인 알림" description="새로운 기기에서 로그인하면 알려드려요." enabled={security[0]} onToggle={() => setSecurity(([first, second]) => [!first, second])} /><ToggleRow divided title="자동 로그인" description="이 기기에서 로그인 상태를 유지해요." enabled={security[1]} onToggle={() => setSecurity(([first, second]) => [first, !second])} /></article><h2>개인정보 이용 안내</h2><article className="privacy-info"><strong>수집하는 정보</strong><span>이름, 학교 이메일, 등록한 물건 정보</span><strong>이용 목적</strong><span>학교 인증, AI 매칭, 물건 반환 연결</span><strong>안전한 정보 공유</strong><span>채팅에서는 연락처 등 민감정보 공유에 주의해 주세요.</span></article><p className="privacy-help">공용 기기에서는 자동 로그인을 꺼 주세요.<br />보안 설정은 변경 즉시 적용돼요.</p></section><button className="privacy-home" onClick={() => navigate('/mypage')}>마이페이지로 이동</button></main>;
}
