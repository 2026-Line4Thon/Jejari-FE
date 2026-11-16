import { Link, useNavigate } from 'react-router-dom';
import { useMatchCandidates } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState, CandidatePhoto, SimilarityBadge } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';

export function MatchingCandidatesView({ data, onBack }) {
  return <MatchingLayout title="매칭 완료" titleId="matching-list-title" onBack={onBack} className="matching-list-page">
    <section className="matching-source" aria-label="내 분실물"><small>내 분실물</small><h2>{data.lostItem.color} {data.lostItem.name}</h2><p>{data.lostItem.place} · {data.lostItem.dateLabel}</p><span className="matching-count">후보 {data.candidates.length}건</span></section>
    <section className="matching-list-intro"><h2><img src={matchingAssets.jejari} alt="" />{data.candidates.length ? 'Jejari가 찾은 유사한 물건이에요' : '비슷한 물건을 계속 찾고 있어요'}</h2><p>유사도뿐 아니라 장소와 시간도 함께 확인해 주세요.</p></section>
    {data.candidates.length ? <div className="matching-candidate-list">{data.candidates.map((candidate) => <Link className="matching-candidate-card" to={candidatePath(candidate.id)} key={candidate.id} aria-label={candidate.name + ', ' + candidate.place + ', ' + candidate.foundAtLabel + ' 상세 보기'}>
      <CandidatePhoto photo={candidate.photo} similarity={candidate.similarity} />
      <div className="matching-candidate-copy"><SimilarityBadge similarity={candidate.similarity} /><h3>{candidate.name}</h3><p className="matching-attributes">{candidate.attributes}</p><p className="matching-candidate-meta"><img src={matchingAssets.map} alt="" /><span>{candidate.place}</span></p><p className="matching-candidate-meta"><img src={matchingAssets.clock} alt="" /><span>{candidate.foundAtLabel}</span></p></div>
      <img className="matching-candidate-chevron" src={matchingAssets.chevron} alt="" />
    </Link>)}</div> : <div className="matching-empty" role="status"><h3>새로운 후보를 계속 찾고 있어요.</h3><p>비슷한 습득물이 등록되면 다시 알려드릴게요.</p></div>}
  </MatchingLayout>;
}

export default function MatchingCandidatesPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useMatchCandidates();
  const onBack = () => navigate('/complete');
  if (isLoading || error) return <MatchingLoadState title="매칭 완료" error={error} onBack={onBack} />;
  return <MatchingCandidatesView data={data} onBack={onBack} />;
}
