import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import pageBackground from '../../assets/lost-method/background.svg';
import progress from '../../assets/lost-method/progress.svg';
import progressActive from '../../assets/lost-method/progress-active.svg';
import photoCard from '../../assets/lost-method/photo-card.svg';
import textCard from '../../assets/lost-method/text-card.svg';
import recommend from '../../assets/lost-method/recommend.svg';
import iconSurface from '../../assets/lost-method/icon-surface.svg';
import photoIcon from '../../assets/lost-method/photo-icon.svg';
import textIcon from '../../assets/lost-method/text-icon.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import navHome from '../../assets/home-nav/home-active.svg';
import navChat from '../../assets/home-nav/chat.svg';
import navMy from '../../assets/home-nav/my.svg';
import navSurface from '../../assets/dashboard-new/nav.svg';
import chevron from '../../assets/dashboard-new/arrow.svg';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="lost-method-page">
      <img className="lost-method-background" src={pageBackground} alt="" />
      <header className="lost-method-header">
        <button type="button" onClick={() => navigate('/home')} aria-label="이전 화면"><img className="lost-method-back-surface" src={backSurface} alt="" /><img className="lost-method-back-arrow" src={backArrow} alt="" /></button>
        <h1>분실물 등록</h1>
      </header>
      <section className="lost-method-content">
        <div className="lost-method-step"><span>등록 방식</span><strong>1 / 3</strong></div>
        <div className="lost-method-progress" aria-hidden="true"><img src={progress} alt="" /><img src={progressActive} alt="" /></div>
        <h2>어떤 방식으로 등록할까요?</h2>
        <p className="lost-method-description">기억나는 특징으로 AI가 찾아드려요.</p>
        <button type="button" className="lost-method-card photo" onClick={() => navigate('/lost-item')}><img className="lost-method-card-surface" src={photoCard} alt="" /><span className="lost-method-recommend"><img src={recommend} alt="" />추천</span><span className="lost-method-icon"><img src={iconSurface} alt="" /><img src={photoIcon} alt="" /></span><span className="lost-method-copy"><strong>사진으로 등록하기</strong><small>비슷한 사진이나 예시 사진도 좋아요</small></span><img className="lost-method-chevron" src={chevron} alt="" /></button>
        <button type="button" className="lost-method-card text" onClick={() => navigate('/lost-item?mode=text')}><img className="lost-method-card-surface" src={textCard} alt="" /><span className="lost-method-icon"><img src={iconSurface} alt="" /><img src={textIcon} alt="" /></span><span className="lost-method-copy"><strong>텍스트로 등록하기</strong><small>사진 없이 특징을 설명할게요</small></span><img className="lost-method-chevron" src={chevron} alt="" /></button>
      </section>
      <nav className="lost-method-navigation" aria-label="주 메뉴">
        <img className="lost-method-nav-surface" src={navSurface} alt="" />
        <Link className="lost-method-home-nav" to="/home"><img src={navHome} alt="" /><span>홈</span></Link>
        <Link to="/notify"><img src={navChat} alt="" /><span>채팅</span></Link>
        <Link to="/mypage"><img src={navMy} alt="" /><span>마이</span></Link>
      </nav>
    </main>
  );
}
