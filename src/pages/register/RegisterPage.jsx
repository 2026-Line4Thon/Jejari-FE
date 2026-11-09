import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import chevronLeft from '../../assets/icons/chevron-left.svg';
import imagePlus from '../../assets/icons/image-plus.svg';
import textCursor from '../../assets/icons/text-cursor-input.svg';
import navHome from '../../assets/icons/nav-home-inactive.svg';
import navSearch from '../../assets/icons/nav-search.svg';
import navAdd from '../../assets/icons/nav-add-active.svg';
import navBell from '../../assets/icons/nav-bell.svg';
import navUser from '../../assets/icons/nav-user.svg';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="register-page">
      <header className="register-header">
        <button type="button" onClick={() => navigate('/home')} aria-label="이전 화면"><img src={chevronLeft} alt="" /></button>
        <h1>분실물 등록</h1>
      </header>
      <section className="register-content">
        <p className="register-kicker">등록 방법 선택</p>
        <h2>어떤 방식으로<br />분실물을 등록할까요?</h2>
        <p className="register-intro">기억나는 정보만 알려주세요.<br />AI가 습득물과 비교해 후보를 찾아드려요.</p>
        <button type="button" className="register-method" onClick={() => navigate('/lost-item')}>
          <img src={imagePlus} alt="" />
          <strong>사진으로 등록하기</strong>
          <span>이전에 찍어둔 물건 사진이 있나요?<br />사진을 올리고 특징을 더해보세요.</span>
          <em>사진 선택하기 ›</em>
        </button>
        <button type="button" className="register-method" onClick={() => navigate('/lost-item?mode=text')}>
          <img src={textCursor} alt="" />
          <strong>텍스트로 등록하기</strong>
          <span>사진이 없어도 괜찮아요.<br />물건의 종류와 기억나는 특징을 적어주세요.</span>
          <em>설명으로 시작하기 ›</em>
        </button>
        <p className="register-note">사진과 텍스트는 함께 사용할 수 있어요.<br />다음 화면에서 언제든 추가하거나 수정할 수 있어요.</p>
      </section>
      <nav className="register-navigation" aria-label="주 메뉴">
        <Link to="/home"><img src={navHome} alt="" />홈</Link>
        <Link to="/find"><img src={navSearch} alt="" />분실물 찾기</Link>
        <Link className="active" to="/register"><img src={navAdd} alt="" />등록하기</Link>
        <Link to="/notify"><img src={navBell} alt="" />알림</Link>
        <Link to="/mypage"><img src={navUser} alt="" />마이페이지</Link>
      </nav>
    </main>
  );
}
