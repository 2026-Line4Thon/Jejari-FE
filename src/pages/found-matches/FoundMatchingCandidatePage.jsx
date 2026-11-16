import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFoundMatchCandidate } from '../../hooks/useFoundMatching';
import { CandidatePhoto, SimilarityBadge, MatchingReasons } from '../../components/matching-flow/MatchingLayout';
import { FoundMatchingLayout, FoundMatchingFeedback } from '../../components/found-matching/FoundMatchingLayout';
import { foundMatchingAssets } from '../../components/found-matching/foundMatchingAssets';
import { foundMatchingListPath } from '../../components/found-matching/foundMatchingRoutes';

export function FoundMatchingCandidateView({ candidate, onBack }) {
  return <FoundMatchingLayout title="매칭 후보 상세" titleId="found-matching-candidate-title" onBack={onBack} detail>
    <div className="matching-detail-hero"><CandidatePhoto photo={candidate.photo} size="detail" similarity={candidate.similarity} /><SimilarityBadge similarity={candidate.similarity} detail /></div>
    <section className="matching-detail-meta"><small>분실물</small><h2>{candidate.name}</h2><p>{candidate.place} · {candidate.lostAtLabel}</p></section>
    <MatchingReasons reasons={candidate.reasons} icon={foundMatchingAssets.jejari} titleId="found-matching-reasons-title" />
  </FoundMatchingLayout>;
}

export default function FoundMatchingCandidatePage() {
  const { candidateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const matching = useFoundMatchCandidate(candidateId);
  const onBack = () => navigate(foundMatchingListPath, { state: location.state });
  if (matching.isLoading || matching.error) return <FoundMatchingLayout title="매칭 후보 상세" titleId="found-matching-candidate-title" onBack={onBack} detail><FoundMatchingFeedback isLoading={matching.isLoading} error={matching.error} onBack={onBack} /></FoundMatchingLayout>;
  return <FoundMatchingCandidateView candidate={matching.data} onBack={onBack} />;
}
