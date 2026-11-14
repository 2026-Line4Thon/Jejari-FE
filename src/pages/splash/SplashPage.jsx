import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';
import splashBase from '../../assets/splash/splash-base.svg';
import splashOverlay from '../../assets/splash/splash-overlay.svg';
import successMark from '../../assets/splash/success-mark.svg';
import jejariMark from '../../assets/splash/jejari-mark.svg';
import loader from '../../assets/splash/loader.svg';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash-page" aria-label="제자리 시작 화면">
      <img className="splash-background" src={splashBase} alt="" />
      <img className="splash-gradient" src={splashOverlay} alt="" />
      <img className="splash-shape" src={successMark} alt="" />

      <section className="splash-content">
        <img className="splash-logo" src={jejariMark} alt="Jejari" />
        <h1>Jejari</h1>
        <p>AI가 찾아주는 캠퍼스 분실물</p>
      </section>

      <div className="splash-loader" aria-label="불러오는 중">
        <img src={loader} alt="" />
        <span />
      </div>
    </main>
  );
}
