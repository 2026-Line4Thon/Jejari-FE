import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMatchCandidate } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState, CandidatePhoto, SimilarityBadge, MatchingReasons } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { matchingListPath, ownershipPath } from '../../components/matching-flow/matchingRoutes';

export function MatchingCandidateDetailView({ candidate, onBack, onReject, isPending = false, error = '' }) {
  return <MatchingLayout title="매칭 후보 상세" titleId="matching-detail-title" onBack={onBack} className="matching-detail-page">
    <div className="matching-detail-hero"><CandidatePhoto photo={candidate.photo} size="detail" similarity={candidate.similarity} /><SimilarityBadge similarity={candidate.similarity} detail /></div>
    <section className="matching-detail-meta"><small>습득물</small><h2>{candidate.name}</h2><p>{candidate.place} · {candidate.foundAtLabel}</p></section>
    <MatchingReasons reasons={candidate.reasons} />
    <aside className="matching-detail-privacy"><img src={matchingAssets.lock} alt="" /><div><strong>비공개 특징은 아직 보여드리지 않아요!</strong><p>내 물건이라고 선택하면 소유권 확인 질문이 시작돼요.</p></div></aside>
    {error && <p className="found-item-error" role="alert">{error}</p>}
    <footer className="matching-detail-footer"><Link className="matching-yes-button" to={ownershipPath(candidate.id)} aria-disabled={isPending} onClick={(event) => { if (isPending) event.preventDefault(); }}>내 물건이 맞아요!</Link><button className="matching-secondary-button" type="button" onClick={onReject} disabled={isPending}>{isPending ? '처리 중이에요' : '내 물건이 아니에요!'}</button></footer>
  </MatchingLayout>;
}

export default function MatchingCandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, isPending, actionError, reject } = useMatchCandidate(candidateId);
  const onBack = () => navigate(matchingListPath);
  const onReject = async () => { if (await reject()) navigate(matchingListPath, { replace: true }); };
  if (isLoading || error) return <MatchingLoadState title="매칭 후보 상세" error={error} onBack={onBack} />;
  return <MatchingCandidateDetailView candidate={data} onBack={onBack} onReject={onReject} isPending={isPending} error={actionError} />;
}
