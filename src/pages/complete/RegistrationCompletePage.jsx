import { useNavigate } from 'react-router-dom';
import './RegistrationCompletePage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import successMark from '../../assets/complete/success-mark.svg';
import checkIcon from '../../assets/complete/check.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import selectedPhoto from '../../assets/photo-result/raw-image-1.png';
import editIcon from '../../assets/ai-feature/edit.svg';
import radarMark from '../../assets/complete/radar-mark.svg';
import radarRingOne from '../../assets/complete/radar-ring-one.svg';
import radarRingTwo from '../../assets/complete/radar-ring-two.svg';
import bellIcon from '../../assets/complete/bell.svg';
export default function RegistrationCompletePage(){const navigate=useNavigate();return <main className="registered-page"><img className="registered-background" src={pageBackground} alt=""/><header><button type="button" onClick={()=>navigate(-1)} aria-label="이전 화면"><img src={backSurface} alt=""/><img src={backArrow} alt=""/></button><h1>분실물 등록 완료</h1></header><section><span className="registered-check"><img src={successMark} alt=""/><img src={checkIcon} alt="등록 완료"/></span><h2>등록이 완료됐어요</h2><p className="registered-notice">비슷한 습득물을 찾는 즉시 알려드릴게요.</p><article className="registered-item"><span className="registered-item-photo"><img src={selectedPhoto} alt="검은색 무선 이어폰"/></span><div><small>잃어버렸어요</small><strong>무선 이어폰</strong><span>중앙도서관 2층 · 3월 18일</span></div><img className="registered-edit" src={editIcon} alt="정보 수정"/></article><article className="registered-matching"><i><img src={radarRingTwo} alt=""/><img src={radarRingOne} alt=""/><img src={radarMark} alt=""/></i><div><strong>AI가 매칭을 진행하고 있어요</strong><span>사진 · 특징 · 장소 · 시간을 함께 비교해요.</span></div></article><article className="registered-info"><img src={bellIcon} alt="알림"/><p>지금 후보가 없어도 등록은 유지되며,<br/>새로운 물건이 올라오면 다시 자동 매칭해요.</p></article></section><footer><button className="registered-home" type="button" onClick={()=>navigate('/home')}>홈으로 이동</button><button className="registered-results" type="button">매칭 결과 확인하기</button></footer></main>}
