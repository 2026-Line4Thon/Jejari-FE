import { useLocation, useNavigate } from 'react-router-dom';
import useFoundMatching from '../../hooks/useFoundMatching';
import { MatchingCandidateCard } from '../../components/matching-flow/MatchingLayout';
import { FoundMatchingLayout, FoundMatchingFeedback } from '../../components/found-matching/FoundMatchingLayout';
import { foundMatchingAssets } from '../../components/found-matching/foundMatchingAssets';
import { foundMatchingCandidatePath } from '../../components/found-matching/foundMatchingRoutes';
import { formatFoundDate } from '../../utils/formatFoundDate';

export function FoundMatchingResultsView({ data, onBack, navigationState }) {
  const detail = [data.foundItem.place, formatFoundDate(data.foundItem.date)].filter(Boolean).join(' · ');
  return <FoundMatchingLayout title="자동 매칭 결과" titleId="found-matching-results-title" onBack={onBack}>
    <section className="matching-source" aria-label="내 습득물">
      <small>내 습득물</small><h2>{[data.foundItem.color, data.foundItem.name].filter(Boolean).join(' ')}</h2><p>{detail}</p><span className="matching-count">후보 {data.candidates.length}건</span>
    </section>
    <section className="matching-list-intro">
      <h2><img src={foundMatchingAssets.jejari} alt="" />{data.candidates.length ? 'Jejari가 일치하는 분실물 후보를 찾았어요' : '일치하는 분실물을 계속 찾고 있어요'}</h2>
    </section>
    {data.candidates.length ? <div className="matching-candidate-list">
      {data.candidates.map((candidate) => <MatchingCandidateCard key={candidate.id} candidate={candidate} dateLabel={candidate.lostAtLabel} to={foundMatchingCandidatePath(candidate.id)} state={navigationState} />)}
    </div> : <div className="matching-empty" role="status"><h3>아직 매칭된 분실물이 없어요.</h3><p>새로운 분실물이 등록되면 다시 알려드릴게요.</p></div>}
  </FoundMatchingLayout>;
}

export default function FoundMatchingResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const matching = useFoundMatching(location.state?.foundItem);
  const onBack = () => navigate('/found-complete', { state: location.state });
  if (matching.isLoading || matching.error) return <FoundMatchingLayout title="자동 매칭 결과" titleId="found-matching-results-title" onBack={onBack}><FoundMatchingFeedback isLoading={matching.isLoading} error={matching.error} onBack={onBack} /></FoundMatchingLayout>;
  return <FoundMatchingResultsView data={matching.data} onBack={onBack} navigationState={location.state} />;
}
