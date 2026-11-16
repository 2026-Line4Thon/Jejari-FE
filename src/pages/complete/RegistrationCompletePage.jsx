import { useLocation, useNavigate } from 'react-router-dom';
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
export default function RegistrationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const foundItem = location.state?.foundItem;
  const foundDraft = foundItem?.foundDraft;
  const foundDate = foundDraft?.date ? new Date(`${foundDraft.date}T00:00:00`).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '';
  const foundDetail = foundDraft ? [foundDraft.place, foundDate].filter(Boolean).join(' · ') : [foundItem?.color, foundItem?.brand].filter(Boolean).join(' · ');
  const editFoundItem = () => {
    window.scrollTo(0, 0);
    navigate('/found-analysis', { state: { foundItem } });
  };

  return (
    <main className={`registered-page${foundItem ? ' registered-found-page' : ''}`}>
      <img className="registered-background" src={pageBackground} alt="" />
      <header>
        <button type="button" onClick={foundItem ? editFoundItem : () => navigate(-1)} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
        <h1>{foundItem ? '습득물' : '분실물'} 등록 완료</h1>
      </header>
      <section>
        <span className="registered-check"><img src={successMark} alt="" /><img src={checkIcon} alt="등록 완료" /></span>
        <h2>등록이 완료됐어요</h2>
        <p className="registered-notice">{foundItem ? '주인을 찾을 수 있도록 자동 매칭을 시작했어요.' : '비슷한 습득물을 찾는 즉시 알려드릴게요.'}</p>
        <article className="registered-item">
          <span className={`registered-item-photo${foundItem?.photoChanged ? ' uploaded-photo' : ''}`}><img src={foundItem?.photo ?? selectedPhoto} alt={foundItem ? `등록한 ${foundItem.kind}` : '검은색 무선 이어폰'} /></span>
          <div><small>{foundItem ? '주웠어요' : '잃어버렸어요'}</small><strong>{foundItem?.kind ?? '무선 이어폰'}</strong><span>{foundItem ? foundDetail : '중앙도서관 2층 · 3월 18일'}</span></div>
          {foundItem ? <button className="registered-edit-button" type="button" aria-label="습득물 정보 수정" onClick={editFoundItem}><img src={editIcon} alt="" /></button> : <img className="registered-edit" src={editIcon} alt="정보 수정" />}
        </article>
        <article className="registered-matching"><i><img src={radarRingTwo} alt="" /><img src={radarRingOne} alt="" /><img src={radarMark} alt="" /></i><div><strong>AI가 매칭을 진행하고 있어요</strong><span>사진 · 특징 · 장소 · 시간을 함께 비교해요.</span></div></article>
        <article className="registered-info"><img src={bellIcon} alt="알림" /><p>지금 후보가 없어도 등록은 유지되며,<br />새로운 물건이 올라오면 다시 자동 매칭해요.</p></article>
      </section>
      <footer>
        <button className="registered-home" type="button" onClick={() => navigate('/home')}>홈으로 이동</button>
        <button className="registered-results" type="button" onClick={foundItem ? editFoundItem : undefined}>{foundItem ? '등록 정보 확인하기' : '매칭 결과 확인하기'}</button>
      </footer>
    </main>
  );
}
