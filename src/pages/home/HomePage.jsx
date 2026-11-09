import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import scanSearchIcon from '../../assets/icons/scan-search.svg';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <header className="login-header">캠퍼스 찾음</header>

      <section className="login-content" aria-labelledby="login-title">
        <div className="scan-icon" aria-hidden="true">
          <img src={scanSearchIcon} alt="" />
        </div>
        <h1 id="login-title">캠퍼스 찾음</h1>
        <p className="login-subtitle">AI가 찾아주는 캠퍼스 분실물</p>
        <p className="login-description">
          잃어버린 물건과 주운 물건을 연결해요.<br />
          우리 학교 안에서, 안전하게.
        </p>
      </section>

      <p className="login-use-note">학교 이메일 인증 후 이용할 수 있어요.</p>

      <footer className="login-footer">
        <button type="button" className="login-button" onClick={() => navigate('/login')}>
          로그인하기
        </button>
      </footer>
    </main>
  );
}
