import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { matchingService } from '../../services/matchingService';
import placeholder from '../../assets/recent-found/placeholder.svg';
import { MatchingLayout, MatchingLoadState, CandidatePhoto, SimilarityBadge, MatchingReasons } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { matchingListPath, ownershipPath, candidateBackPath } from '../../components/matching-flow/matchingRoutes';

export function MatchingCandidateDetailView({ candidate, onBack, onReject, isPending = false, error = '', navigationState }) {
  return <MatchingLayout title="매칭 후보 상세" titleId="matching-detail-title" onBack={onBack} className="matching-detail-page">
    <div className="matching-detail-hero"><CandidatePhoto photo={candidate.photo} size="detail" similarity={candidate.similarity} /><SimilarityBadge similarity={candidate.similarity} detail /></div>
    <section className="matching-detail-meta"><small>습득물</small><h2>{candidate.name}</h2><p>{candidate.place} · {candidate.foundAtLabel}</p></section>
    <MatchingReasons reasons={candidate.reasons} />
    <aside className="matching-detail-privacy"><img src={matchingAssets.lock} alt="" /><div><strong>비공개 특징은 아직 보여드리지 않아요!</strong><p>내 물건이라고 선택하면 소유권 확인 질문이 시작돼요.</p></div></aside>
    {error && <p className="found-item-error" role="alert">{error}</p>}
    <footer className="matching-detail-footer"><Link className="matching-yes-button" to={ownershipPath(candidate.id)} state={navigationState} aria-disabled={isPending} onClick={(event) => { if (isPending) event.preventDefault(); }}>내 물건이 맞아요!</Link><button className="matching-secondary-button" type="button" onClick={onReject} disabled={isPending}>{isPending ? '처리 중이에요' : '내 물건이 아니에요!'}</button></footer>
  </MatchingLayout>;
}

function formatFoundAt(value) {
  if (!value) return '습득 일시 정보 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

function mapCandidate(data) {
  const item = data.found_item ?? {};
  const similarityLabel = String(data.similarity_label ?? '').toLowerCase();
  return {
    id: data.candidate_id,
    name: item.item_name || '습득물',
    similarity: similarityLabel.includes('높') || similarityLabel.includes('high') ? 'high' : 'low',
    place: item.place_name || '습득 장소 정보 없음',
    foundAtLabel: formatFoundAt(item.found_at),
    photo: { source: item.image_url || placeholder },
    reasons: (data.reasons ?? []).map((reason) => ({
      title: reason.field || '매칭 근거',
      description: reason.text || (reason.is_match ? '등록 정보와 일치해요.' : '직접 확인해 주세요.'),
    })),
  };
}

export default function MatchingCandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [actionError, setActionError] = useState('');
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    const loadCandidate = async () => {
      setIsLoading(true); setError(''); setActionError('');
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 매칭 후보를 확인할 수 있어요.');

        const response = await fetch(`https://miseno.store/candidates/${candidateId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const responseData = await response.json();
        if (response.status === 403) throw new Error('등록한 분실물이 없어요.');
        if (!response.ok) throw new Error(responseData.detail || '매칭 후보 정보를 불러오지 못했어요.');
        if (active) setData(mapCandidate(responseData));
      } catch (loadError) {
        if (active) setError(loadError.message || '매칭 후보 정보를 불러오지 못했어요.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadCandidate();
    return () => { active = false; };
  }, [candidateId]);

  const listPath = matchingListPath + (location.state?.lostItemId ? '?itemId=' + location.state.lostItemId : '');
  const onBack = () => navigate(candidateBackPath(location.state), { replace: true });
  const onReject = async () => {
    if (busy.current) return;
    busy.current = true; setIsPending(true); setActionError('');
    try { await matchingService.rejectCandidate(candidateId); navigate(listPath, { replace: true, state: location.state }); }
    catch (failure) { setActionError(failure.message); }
    finally { busy.current = false; setIsPending(false); }
  };
  if (isLoading || error) return <MatchingLoadState title="매칭 후보 상세" error={error} onBack={onBack} />;
  return <MatchingCandidateDetailView candidate={data} onBack={onBack} onReject={onReject} isPending={isPending} error={actionError} navigationState={location.state} />;
}
