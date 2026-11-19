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
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const canStart = codeSent && verificationCode.length === 6 && !isVerifying;

  const sendVerificationCode = async () => {
    if (!email.trim() || isSending) return;

    setIsSending(true);
    setRequestMessage('');

    try {
      const response = await fetch('https://miseno.store/auth/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.email?.[0] || '인증번호 발송에 실패했습니다.');
      }

      setCodeSent(true);
      setRequestMessage(data.message || '인증번호가 발송되었습니다.');
    } catch (error) {
      setRequestMessage(error.message || '인증번호 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyCodeAndStart = async () => {
    if (!canStart) return;

    setIsVerifying(true);
    setRequestMessage('');

    try {
      const response = await fetch('https://miseno.store/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.code?.[0] || '인증번호 확인에 실패했습니다.');
      }

      const accessToken = data.access_token || data.accessToken || data.access || data.token;
      const refreshToken = data.refresh_token || data.refreshToken || data.refresh;
      if (!accessToken) {
        throw new Error('로그인 토큰을 받지 못했습니다.');
      }

      localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      navigate('/home');
    } catch (error) {
      setRequestMessage(error.message || '인증번호 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
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

        <button className="request-code-button" type="button" onClick={sendVerificationCode} disabled={isSending}>
          <img src={requestCodeSurface} alt="" />
          <span>{isSending ? '발송 중...' : codeSent ? '인증번호 재발송' : '인증번호 받기'}</span>
        </button>
        {requestMessage && <p role="status">{requestMessage}</p>}

        <label className="login-label code-label" htmlFor="verification-code">인증번호</label>
        <div className="surface-field code-field">
          <img src={codeInputSurface} alt="" />
          <input id="verification-code" type="text" inputMode="numeric" maxLength="6" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))} placeholder="6자리 숫자 입력" />
        </div>

        <p className="login-security-note"><img src={infoIcon} alt="" />인증 정보는 학교 구성원 확인에만 사용돼요.</p>
      </section>

      <footer className="school-auth-footer">
        <button type="button" disabled={!canStart} onClick={verifyCodeAndStart}>
          <img src={startButtonSurface} alt="" />
          <span>{isVerifying ? '인증 중...' : '인증하고 시작하기'}</span>
        </button>
      </footer>
    </main>
  );
}
