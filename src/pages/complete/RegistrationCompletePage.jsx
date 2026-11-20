import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { foundItemService } from '../../services/foundItemService';
import './RegistrationCompletePage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import successMark from '../../assets/complete/success-mark.svg';
import checkIcon from '../../assets/complete/check.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import editIcon from '../../assets/ai-feature/edit.svg';
import radarMark from '../../assets/complete/radar-mark.svg';
import radarRingOne from '../../assets/complete/radar-ring-one.svg';
import radarRingTwo from '../../assets/complete/radar-ring-two.svg';
import bellIcon from '../../assets/complete/bell.svg';
import FoundRegistrationCompletePage from '../found-complete/FoundRegistrationCompletePage';
export default function RegistrationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const foundItem = location.state?.foundItem;
  const [params] = useSearchParams();
  const itemId = params.get('itemId') || location.state?.lostItemId;
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (foundItem) return;
    const controller = new AbortController();
    foundItemService.getLost(itemId, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setItem(data);
    }).catch((failure) => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [itemId, foundItem]);
  const date = item?.lost_from ? new Date(item.lost_from) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric' }).format(date) : '';
  const place = [item?.place?.name, item?.location_detail].filter(Boolean).join(' ');

  if (foundItem) return <FoundRegistrationCompletePage />;

  return (
    <main className="registered-page">
      <img className="registered-background" src={pageBackground} alt="" />
      <header>
        <button type="button" onClick={() => navigate(-1)} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
        <h1>분실물 등록 완료</h1>
      </header>
      <section>
        <span className="registered-check"><img src={successMark} alt="" /><img src={checkIcon} alt="등록 완료" /></span>
        <h2>등록이 완료됐어요</h2>
        <p className="registered-notice" role={error ? 'alert' : 'status'}>{error || (!item ? '등록 정보를 불러오고 있어요.' : '비슷한 습득물을 찾는 즉시 알려드릴게요.')}</p>
        <article className="registered-item">
          <span className="registered-item-photo">{item?.image_url && <img src={item.image_url} alt={item.item_name || '등록한 분실물'} />}</span>
          <div><small>잃어버렸어요</small><strong>{item?.item_name || ''}</strong><span>{[place, dateLabel].filter(Boolean).join(' · ')}</span></div>
          <img className="registered-edit" src={editIcon} alt="정보 수정" />
        </article>
        <article className="registered-matching"><i><img src={radarRingTwo} alt="" /><img src={radarRingOne} alt="" /><img src={radarMark} alt="" /></i><div><strong>AI가 매칭을 진행하고 있어요</strong><span>사진 · 특징 · 장소 · 시간을 함께 비교해요.</span></div></article>
        <article className="registered-info"><img src={bellIcon} alt="알림" /><p>지금 후보가 없어도 등록은 유지되며,<br />새로운 물건이 올라오면 다시 자동 매칭해요.</p></article>
      </section>
      <footer>
        <button className="registered-home" type="button" onClick={() => navigate('/home')}>홈으로 이동</button>
        <button className="registered-results" type="button" disabled={!item} onClick={() => navigate('/matches?itemId=' + item.lost_item_id)}>매칭 결과 확인하기</button>
      </footer>
    </main>
  );
}
