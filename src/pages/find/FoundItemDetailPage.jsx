import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MatchingLayout, MatchingLoadState, CandidatePhoto } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { ownershipPath } from '../../components/matching-flow/matchingRoutes';
import { foundItemDetailService } from '../../services/foundItemDetailService';
import placeholder from '../../assets/recent-found/placeholder.svg';

function formatDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
    : '';
}

function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return placeholder;
  try {
    const url = new URL(value, 'https://miseno.store');
    return ['http:', 'https:'].includes(url.protocol) ? url.href : placeholder;
  } catch { return placeholder; }
}

export default function FoundItemDetailPage() {
  const { itemId } = useParams();
  return <FoundItemDetail key={itemId} itemId={itemId} />;
}

function FoundItemDetail({ itemId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const action = useRef(null);
  const returnTo = location.state?.returnTo === '/home' ? '/home' : '/find';
  const onBack = () => navigate(returnTo);

  useEffect(() => {
    const controller = new AbortController();
    foundItemDetailService.getDetail(itemId, { signal: controller.signal }).then((data) => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('물건 상세 정보를 확인할 수 없어요.');
      const responseId = data.found_item_id ?? data.id;
      if (responseId != null && String(responseId) !== String(itemId)) throw new Error('선택한 물건의 상세 정보를 확인할 수 없어요.');
      if (!controller.signal.aborted) setItem(data);
    }).catch((failure) => {
      if (!controller.signal.aborted) setError(failure.message);
    }).finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => { controller.abort(); action.current?.abort(); action.current = null; };
  }, [itemId]);

  const openOwnership = async () => {
    if (action.current) return;
    const controller = new AbortController();
    action.current = controller;
    setIsPending(true); setActionError('');
    try {
      const candidate = await foundItemDetailService.getOwnershipCandidate(itemId, { signal: controller.signal });
      if (!controller.signal.aborted) navigate(ownershipPath(candidate.candidateId), { state: { ...location.state, lostItemId: candidate.lostItemId } });
    } catch (failure) {
      if (!controller.signal.aborted) setActionError(failure.message);
    } finally {
      if (!controller.signal.aborted) { action.current = null; setIsPending(false); }
    }
  };

  if (isLoading || error) return <MatchingLoadState title="습득물 상세" error={error} onBack={onBack} />;
  return <FoundItemDetailView item={item} onBack={onBack} onOwnership={openOwnership} isPending={isPending} error={actionError} />;
}

export function FoundItemDetailView({ item, onBack, onOwnership, isPending = false, error = '' }) {
  const name = item.item_name || '습득물';
  const place = item.found_location || [item.place_name || item.place?.name, item.location_detail].filter(Boolean).join(' ');
  const features = Array.isArray(item.features) ? item.features.join(' · ') : item.features;
  return <MatchingLayout title="습득물 상세" titleId="found-detail-title" onBack={onBack} className="matching-detail-page">
    <div className="matching-detail-hero"><CandidatePhoto photo={{ source: imageUrl(item.blurred_image_url || item.image_url) }} size="detail" /></div>
    <section className="matching-detail-meta"><small>습득물</small><h2>{name}</h2><p>{[place, formatDate(item.found_at)].filter(Boolean).join(' · ')}</p>
      {item.category && <p>종류: {item.category}</p>}
      {item.color && <p>색상: {item.color}</p>}
      {item.brand && <p>브랜드: {item.brand}</p>}
      {features && <p>특징: {features}</p>}
    </section>
    <aside className="matching-detail-privacy"><img src={matchingAssets.lock} alt="" /><div><strong>비공개 특징은 아직 보여드리지 않아요!</strong><p>내 물건이라고 선택하면 소유권 확인 질문이 시작돼요.</p></div></aside>
    {error && <p className="found-item-error" role="alert">{error}</p>}
    <footer className="matching-detail-footer"><button className="matching-yes-button" type="button" onClick={onOwnership} disabled={isPending}>{isPending ? '확인 중이에요' : '내 물건이 맞아요!'}</button><button className="matching-secondary-button" type="button" onClick={onBack} disabled={isPending}>내 물건이 아니에요!</button></footer>
  </MatchingLayout>;
}
