import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SchoolAuthPage.css';
import loginBackground from '../../assets/login/login-bg.svg';
import loginLogo from '../../assets/login/login-logo.svg';
import emailInputSurface from '../../assets/login/email-input.svg';
import requestCodeSurface from '../../assets/login/code-request.svg';
import codeInputSurface from '../../assets/login/code-input.svg';
import infoIcon from '../../assets/login/info-icon.svg';
import startButtonSurface from '../../assets/login/start-button.svg';

export default function SchoolAuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const canStart = codeSent && verificationCode.length === 6;

  const sendVerificationCode = () => {
    if (email.trim()) setCodeSent(true);
  };

  return (
    <main className="school-auth-page" aria-labelledby="school-auth-title">
      <img className="login-background" src={loginBackground} alt="" />
      <section className="school-auth-content">
        <img className="login-logo" src={loginLogo} alt="제자리" />
        <p className="login-eyebrow">학교 구성원 전용</p>
        <h1 id="school-auth-title">우리 학교에서<br />잃어버린 물건 함께 찾아요</h1>
        <p className="login-description">안전한 이용을 위해 학교 이메일 인증이 필요해요.</p>

        <label className="login-label" htmlFor="school-email">학교 이메일</label>
        <div className="surface-field email-field">
          <img src={emailInputSurface} alt="" />
          <input id="school-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@univ.ac.kr" />
        </div>

        <button className="request-code-button" type="button" onClick={sendVerificationCode}>
          <img src={requestCodeSurface} alt="" />
          <span>{codeSent ? '인증번호 재발송' : '인증번호 받기'}</span>
        </button>

        <label className="login-label code-label" htmlFor="verification-code">인증번호</label>
        <div className="surface-field code-field">
          <img src={codeInputSurface} alt="" />
          <input id="verification-code" type="text" inputMode="numeric" maxLength="6" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))} placeholder="6자리 숫자 입력" />
        </div>

        <p className="login-security-note"><img src={infoIcon} alt="" />인증 정보는 학교 구성원 확인에만 사용돼요.</p>
      </section>

      <footer className="school-auth-footer">
        <button type="button" disabled={!canStart} onClick={() => navigate('/home')}>
          <img src={startButtonSurface} alt="" />
          <span>인증하고 시작하기</span>
        </button>
      </footer>
    </main>
  );
}
