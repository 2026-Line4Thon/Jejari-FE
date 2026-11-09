import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronLeft from '../../assets/icons/chevron-left.svg';
import './SchoolAuthPage.css';

export default function SchoolAuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const sendVerificationCode = () => {
    if (email.trim()) {
      setCodeSent(true);
      setIsVerified(false);
    }
  };

  const verifyCode = () => {
    setIsVerified(true);
  };

  return (
    <main className="school-auth-page">
      <header className="school-auth-header">
        <button className="back-button" type="button" onClick={() => navigate('/')} aria-label="이전 화면">
          <img src={chevronLeft} alt="" />
        </button>
        <h1>로그인 및 학교 인증</h1>
      </header>

      <section className="school-auth-content" aria-labelledby="school-auth-title">
        <div className="school-auth-intro">
          <h2 id="school-auth-title">우리 학교 구성원인지<br />확인할게요</h2>
          <p>캠퍼스 찾음은 지정된 한 학교의 구성원만 이용할 수 있어요.</p>
        </div>

        <div className="auth-field">
          <label htmlFor="school-email">학교 이메일</label>
          <input id="school-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="학교 이메일 주소를 입력해 주세요" />
        </div>
        <button className="outline-button" type="button" onClick={sendVerificationCode}>
          {codeSent ? '인증번호 재발송' : '인증번호 받기'}
        </button>

        <div className="verification-section">
          <div className="auth-field">
            <label htmlFor="verification-code">인증번호</label>
            <input id="verification-code" type="text" inputMode="numeric" maxLength="6" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} placeholder="이메일로 받은 6자리 번호" />
          </div>
          <div className="verification-actions">
            <p>유효 시간 02:59 · 재발송</p>
            <button className="confirm-button" type="button" onClick={verifyCode}>확인</button>
          </div>
        </div>

        <aside className="auth-info-card">
          <span>{isVerified ? '인증 완료' : '확인 전'}</span>
          <p>{isVerified ? '학교 이메일 인증이 완료되었어요.' : '학교 이메일 인증을 완료하면 로그인할 수 있어요.'}</p>
        </aside>

        <p className="auth-help-text">
          인증번호가 오지 않으면 스팸함과 이메일 주소를 확인해 주세요. 인증은 서비스 이용 자격 확인에만 사용해요.
        </p>
        <p className="school-restriction">학교가 다르거나 학교 이메일이 없으면 이용이 제한될 수 있어요.</p>
      </section>

      <footer className="school-auth-footer">
        <button className={isVerified ? 'is-active' : ''} type="button" disabled={!isVerified} onClick={() => navigate('/home')}>로그인</button>
      </footer>
    </main>
  );
}
