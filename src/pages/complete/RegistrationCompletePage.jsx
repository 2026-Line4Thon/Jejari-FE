import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { apiEnabled } from '../../api/config';
import { jejariApi } from '../../api/endpoints';
import { lostItemModel } from '../../api/mappers';
import useApiResource from '../../hooks/useApiResource';
import { getLostRegistrationPreview, restoreLostRegistrationPreview } from '../../mocks/lostRegistrationStore';
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
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId') ?? location.state?.lostItemId;
  const result = useApiResource(useCallback(async (signal) => apiEnabled && !foundItem ? lostItemModel(await jejariApi.lostItem(itemId, { signal })) : null, [itemId, foundItem]));
  const preview = location.state?.lostPreview ?? getLostRegistrationPreview(itemId);
  const item = apiEnabled ? result.data : preview;
  useEffect(() => { if (!apiEnabled && preview) restoreLostRegistrationPreview(preview); }, [preview]);

  if (foundItem) return <FoundRegistrationCompletePage />;

  return (
    <main className="registered-page">
      <img className="registered-background" src={pageBackground} alt="" />
      <header>
        <button type="button" onClick={() => navigate(-1)} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
        <h1>{apiEnabled ? '분실물 등록 완료' : '등록 정보 미리보기'}</h1>
      </header>
      <section>
        <span className="registered-check"><img src={successMark} alt="" /><img src={checkIcon} alt={apiEnabled ? '등록 완료' : '입력 정보 확인'} /></span>
        <h2>{apiEnabled ? '등록이 완료됐어요' : '입력 정보를 정리했어요'}</h2>
        <p className="registered-notice" role={result.error ? 'alert' : 'status'}>{result.error || (apiEnabled ? '비슷한 습득물을 찾는 즉시 알려드릴게요.' : item ? '서버에 저장되지 않은 미리보기예요.' : '기본 정보 입력 화면에서 물건을 입력해 주세요.')}</p>
        <article className="registered-item">
          <span className="registered-item-photo">{item?.photo?.source && <img src={item.photo.source} alt={item.name} />}</span>
          <div><small>잃어버렸어요</small><strong>{item?.name}</strong><span>{[item?.place, item?.dateLabel].filter(Boolean).join(' · ')}</span></div>
          <img className="registered-edit" src={editIcon} alt="정보 수정" />
        </article>
        <article className="registered-matching"><i><img src={radarRingTwo} alt="" /><img src={radarRingOne} alt="" /><img src={radarMark} alt="" /></i><div><strong>{apiEnabled ? 'AI가 매칭을 진행하고 있어요' : '아직 매칭 전이에요'}</strong><span>{apiEnabled ? '사진 · 특징 · 장소 · 시간을 함께 비교해요.' : '서버 연결 후 실제 매칭을 시작할 수 있어요.'}</span></div></article>
        <article className="registered-info"><img src={bellIcon} alt="알림" /><p>{apiEnabled ? <>지금 후보가 없어도 등록은 유지되며,<br />새로운 물건이 올라오면 다시 자동 매칭해요.</> : <>현재는 입력 정보만 확인할 수 있어요.<br />실제 등록은 서버 연결 후 가능해요.</>}</p></article>
      </section>
      <footer>
        <button className="registered-home" type="button" onClick={() => navigate('/home')}>홈으로 이동</button>
        <button className="registered-results" type="button" disabled={!item} onClick={() => navigate('/matches?itemId=' + encodeURIComponent(item.id))}>{apiEnabled ? '매칭 결과 확인하기' : '후보 미리보기'}</button>
      </footer>
    </main>
  );
}
