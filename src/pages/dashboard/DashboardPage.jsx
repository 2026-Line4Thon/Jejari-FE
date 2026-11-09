import './DashboardPage.css';
import bellIcon from '../../assets/icons/bell.svg';
import searchIcon from '../../assets/icons/search-card.svg';
import packageIcon from '../../assets/icons/package-plus.svg';
import chevronCard from '../../assets/icons/chevron-card.svg';
import chevronCardTwo from '../../assets/icons/chevron-card-2.svg';
import chevronList from '../../assets/icons/chevron-list.svg';
import imagePlaceholder from '../../assets/icons/image-placeholder.svg';
import navHome from '../../assets/icons/nav-home.svg';
import navSearch from '../../assets/icons/nav-search.svg';
import navAdd from '../../assets/icons/nav-add.svg';
import navBell from '../../assets/icons/nav-bell.svg';
import navUser from '../../assets/icons/nav-user.svg';

const lostItems = [
  { status: '새 습득물', name: '검정 무선 이어폰 케이스', detail: '중앙도서관 2층 · 11.02 14:30', fresh: true },
  { status: '보관 중', name: '회색 접이식 우산', detail: '학생회관 1층 · 11.02 12:10', fresh: false },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>캠퍼스 찾음</h1>
        <img src={bellIcon} alt="알림" />
      </header>
      <section className="dashboard-content">
        <h2>무엇을 도와드릴까요?</h2>
        <p className="dashboard-description">우리 학교에서 잃어버린 물건을 찾아보세요.</p>
        <button className="service-card lost-card" type="button">
          <img src={searchIcon} alt="" /><span><strong>물건을 잃어버렸어요</strong><small>사진이나 설명으로 분실물 등록</small></span><img className="chevron" src={chevronCard} alt="" />
        </button>
        <button className="service-card found-card" type="button">
          <img src={packageIcon} alt="" /><span><strong>물건을 주웠어요</strong><small>사진을 올리고 주인과 연결</small></span><img className="chevron" src={chevronCardTwo} alt="" />
        </button>
        <div className="recent-title"><h3>최근 습득물</h3><button type="button">전체 보기</button></div>
        {lostItems.map((item) => (
          <article className="lost-item" key={item.name}>
            <div className="lost-thumbnail"><img src={imagePlaceholder} alt="" /></div>
            <div><span className={item.fresh ? 'fresh-badge' : 'stored-badge'}>{item.status}</span><strong>{item.name}</strong><small>{item.detail}</small></div>
            <img className="list-chevron" src={chevronList} alt="" />
          </article>
        ))}
        <article className="summary-card"><div><strong>내 분실물 1건</strong><span>후보 2건</span></div><p>검정 무선 이어폰 케이스 · 매칭 확인하기 ›</p></article>
      </section>
      <nav className="bottom-navigation" aria-label="주 메뉴">
        <a className="active" href="/home"><img src={navHome} alt="" />홈</a><a href="/find"><img src={navSearch} alt="" />분실물 찾기</a><a href="/register"><img src={navAdd} alt="" />등록하기</a><a href="/notify"><img src={navBell} alt="" />알림</a><a href="/mypage"><img src={navUser} alt="" />마이페이지</a>
      </nav>
    </main>
  );
}
