import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FoundItemHeader } from '../../components/found-item/FoundItemLayout';
import { foundMatchingListPath } from '../../components/found-matching/foundMatchingRoutes';
import { formatFoundDate } from '../../utils/formatFoundDate';
import { createMockFoundRegistration } from '../../mocks/foundItems';
import successGlow from '../../assets/found-complete/success-glow.svg';
import successCheck from '../../assets/complete/check.svg';
import editIcon from '../../assets/found-complete/edit.svg';
import foundBadge from '../../assets/recent-found/found-badge.svg';
import radarSurface from '../../assets/complete/radar.svg';
import radarInner from '../../assets/complete/radar-ring-one.svg';
import radarOuter from '../../assets/complete/radar-ring-two.svg';
import radarSearch from '../../assets/complete/radar-mark.svg';
import bell from '../../assets/complete/bell.svg';
import './FoundRegistrationCompletePage.css';

export default function FoundRegistrationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [item] = useState(() => {
    const mock = createMockFoundRegistration();
    const incoming = location.state?.foundItem;
    return incoming ? { ...mock, ...incoming, foundDraft: incoming.foundDraft ?? mock.foundDraft } : mock;
  });
  const detail = [item.foundDraft.place, formatFoundDate(item.foundDraft.date)].filter(Boolean).join(' · ');

  const editItem = () => {
    window.scrollTo(0, 0);
    navigate('/found-analysis', { state: { foundItem: item } });
  };
  const goHome = () => { window.scrollTo(0, 0); navigate('/home'); };
  const openResults = () => navigate(foundMatchingListPath, { state: { foundItem: item } });

  return (
    <main className="found-item-page found-completion-page" aria-labelledby="found-completion-title">
      <FoundItemHeader titleId="found-completion-title" title="습득물 등록 완료" onBack={editItem} onClose={goHome} />
      <section className="found-completion-hero" aria-labelledby="found-completion-message">
        <div className="found-completion-mark" aria-hidden="true"><img src={successGlow} alt="" /><img src={successCheck} alt="" /></div>
        <h2 id="found-completion-message">등록이 완료됐어요</h2>
        <p>주인을 찾을 수 있도록 자동 매칭을 시작했어요.</p>
      </section>

      <article className="found-completion-summary" aria-label="등록한 습득물">
        <div className="found-completion-photo">
          <div className={'found-completion-photo-crop' + (!item.photoChanged ? ' is-sample' : '')}><img src={item.photo} alt={item.kind + ' 사진'} /></div>
        </div>
        <div className="found-completion-item-copy">
          <span className="found-completion-badge"><img src={foundBadge} alt="" /><span>주웠어요</span></span>
          <h3 title={item.kind}>{item.kind}</h3>
          <p title={detail}>{detail}</p>
        </div>
        <button className="found-completion-edit" type="button" aria-label="습득물 정보 수정" onClick={editItem}><img src={editIcon} alt="" /></button>
      </article>

      <section className="found-completion-matching" aria-labelledby="found-completion-matching-title">
        <div className="found-completion-radar" aria-hidden="true"><img src={radarSurface} alt="" /><img src={radarInner} alt="" /><img src={radarOuter} alt="" /><img src={radarSearch} alt="" /></div>
        <div><h3 id="found-completion-matching-title">AI가 매칭을 진행하고 있어요</h3><p>사진 · 특징 · 장소 · 시간을 함께 비교해요.</p></div>
      </section>
      <aside className="found-completion-info"><img src={bell} alt="" /><p>지금 후보가 없어도 등록은 유지되며,<br />새로운 물건이 올라오면 다시 자동 매칭해요.</p></aside>

      <footer className="found-completion-footer">
        <button className="found-completion-results" type="button" onClick={openResults}>자동 매칭 결과 보기</button>
        <button className="found-completion-home" type="button" onClick={goHome}>홈으로 이동</button>
      </footer>

    </main>
  );
}
