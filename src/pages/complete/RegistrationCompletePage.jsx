import { useNavigate } from 'react-router-dom';
import './RegistrationCompletePage.css';
import checkIcon from '../../assets/icons/circle-check.svg';
import homeIcon from '../../assets/icons/nav-home-inactive.svg';
import searchIcon from '../../assets/icons/nav-search.svg';
import addIcon from '../../assets/icons/nav-add-active.svg';
import bellIcon from '../../assets/icons/nav-bell.svg';
import userIcon from '../../assets/icons/nav-user.svg';
export default function RegistrationCompletePage(){const navigate=useNavigate();return <main className="complete-page"><header>분실물 등록 완료</header><section><img className="check" src={checkIcon} alt="등록 완료"/><h1>분실물을 등록했어요</h1><p>AI가 교내 습득물과 비교하고 있어요.<br/>후보가 생기면 알림으로 알려드릴게요.</p><h2>AI가 정리한 공개 요약</h2><article><div><b>검정 무선 이어폰 케이스</b><span>분실물</span></div><p>마지막 확인 · 중앙도서관 2층</p><p>2026.11.02 · 14:00</p><strong>검정색 · 둥근 사각형 · 무광 표면</strong><small>브랜드 미확인 · 공개 정보만 표시해요.</small></article><aside><b>매칭 진행 중</b><p>종류·색상·공개 특징과 장소·시간을 함께 비교해요.</p></aside><button className="edit-button">정보 수정하기</button></section><footer className="complete-actions"><button className="primary">매칭 결과 확인하기</button><button className="secondary" onClick={()=>navigate('/home')}>홈으로</button></footer><nav className="complete-nav"><button onClick={()=>navigate('/home')}><img src={homeIcon} alt=""/>홈</button><button><img src={searchIcon} alt=""/>분실물 찾기</button><button className="active"><img src={addIcon} alt=""/>등록하기</button><button><img src={bellIcon} alt=""/>알림</button><button><img src={userIcon} alt=""/>마이페이지</button></nav></main>}
