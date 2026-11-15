import { useNavigate } from 'react-router-dom';
import './FindPage.css';
import pageBackground from '../../assets/login/login-bg.svg';
import introSurface from '../../assets/recent-found/intro.svg';
import cardSurface from '../../assets/recent-found/card.svg';
import placeholder from '../../assets/recent-found/placeholder.svg';
import pin from '../../assets/recent-found/pin.svg';
import clock from '../../assets/recent-found/clock.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import foundBadge from '../../assets/recent-found/found-badge.svg';
import lostBadge from '../../assets/recent-found/lost-badge.svg';
import privacyBadge from '../../assets/recent-found/privacy-badge.svg';
import privacyIcon from '../../assets/recent-found/privacy-icon.svg';
import arrow from '../../assets/dashboard-new/arrow.svg';
import navSurface from '../../assets/dashboard-new/nav.svg';
import navHome from '../../assets/home-nav/home-active.svg';
import navChat from '../../assets/home-nav/chat.svg';
import navMy from '../../assets/home-nav/my.svg';
import photoOne from '../../assets/dashboard-new/photo-1.png';
import photoTwo from '../../assets/dashboard-new/photo-2.png';
import photoThree from '../../assets/dashboard-new/photo-3.png';
import photoFour from '../../assets/recent-found/photo-4.png';

const foundItems = [
  { name: '텀블러', place: '중앙도서관 1층', date: '3월 17일 오후 2:15', image: photoOne, status: 'found' },
  { name: '카드지갑', place: '학생회관 2층', date: '3월 18일 오후 2:15', image: photoTwo, status: 'found', private: true },
  { name: '우산', place: '공학관 A동', date: '3월 18일 오후 2:15', image: photoThree, status: 'lost' },
  { name: '무선 마우스', place: '중앙도서관 2층', date: '3월 19일 오후 11:20', image: photoFour, status: 'lost' },
];

export default function FindPage() {
  const navigate = useNavigate();
  return (
    <main className="recent-found-page" aria-labelledby="recent-found-title">
      <img className="recent-found-background" src={pageBackground} alt="" />
      <header className="recent-found-header">
        <button type="button" onClick={() => navigate('/home')} aria-label="이전 화면"><img className="back-surface" src={backSurface} alt="" /><img className="back-arrow" src={backArrow} alt="" /></button>
        <h1 id="recent-found-title">최근 등록된 분실물</h1>
      </header>
      <section className="recent-found-content">
        <aside className="recent-found-intro"><img src={introSurface} alt="" /><div className="recent-found-intro-copy"><strong>우리 학교에 최근 등록된 물건이에요</strong><p>물건을 선택하면 습득 장소와 특징을 확인할 수 있어요.</p></div></aside>
        <div className="found-list">
          {foundItems.map((item) => (
            <button className="found-item-card" type="button" key={item.name}>
              <img className="found-card-surface" src={cardSurface} alt="" />
              <div className="found-photo"><img src={placeholder} alt="" /><img className={item.private ? 'found-photo-image is-private' : 'found-photo-image'} src={item.image} alt="" />{item.private && <span className="found-privacy-badge"><img src={privacyBadge} alt="" /><img src={privacyIcon} alt="" /><em>민감정보 블러</em></span>}</div>
              <div className="found-item-copy"><span className={`found-badge ${item.status}`}><img src={item.status === 'found' ? foundBadge : lostBadge} alt="" />{item.status === 'found' ? '주웠어요' : '잃어버렸어요'}</span><strong>{item.name}</strong><span><img src={pin} alt="" />{item.place}</span><span><img src={clock} alt="" />{item.date}</span></div>
              <img className="found-arrow" src={arrow} alt="" />
            </button>
          ))}
        </div>
      </section>
      <nav className="recent-found-nav" aria-label="주 메뉴"><img className="recent-found-nav-surface" src={navSurface} alt="" /><a href="/home"><img src={navHome} alt="" /><span>홈</span></a><a href="/notify"><img src={navChat} alt="" /><span>채팅</span></a><a href="/mypage"><img src={navMy} alt="" /><span>마이</span></a></nav>
    </main>
  );
}
