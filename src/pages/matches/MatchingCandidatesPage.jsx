import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMatchCandidates } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState, MatchingCandidateCard } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';

export function MatchingCandidatesView({ data, onBack, navigationState }) {
  return <MatchingLayout title={data.lostItem.isPreview ? '매칭 미리보기' : '매칭 완료'} titleId="matching-list-title" onBack={onBack} className="matching-list-page">
    <section className="matching-source" aria-label="내 분실물"><small>내 분실물</small><h2>{data.lostItem.color} {data.lostItem.name}</h2><p>{data.lostItem.place} · {data.lostItem.dateLabel}</p><span className="matching-count">후보 {data.candidates.length}건</span></section>
    <section className="matching-list-intro"><h2><img src={matchingAssets.jejari} alt="" />{data.lostItem.isPreview ? '입력한 물건의 매칭 미리보기예요' : data.candidates.length ? 'Jejari가 찾은 유사한 물건이에요' : '비슷한 물건을 계속 찾고 있어요'}</h2><p>유사도뿐 아니라 장소와 시간도 함께 확인해 주세요.</p></section>
    {data.candidates.length ? <div className="matching-candidate-list">{data.candidates.map((candidate) => <MatchingCandidateCard key={candidate.id} candidate={candidate} dateLabel={candidate.foundAtLabel} to={candidatePath(candidate.id)} state={navigationState} />)}</div> : <div className="matching-empty" role="status"><h3>{data.lostItem.isPreview ? '아직 실제 매칭 결과가 없어요.' : '새로운 후보를 계속 찾고 있어요.'}</h3><p>{data.lostItem.isPreview ? '서버 연결 후 매칭 결과를 확인할 수 있어요.' : '비슷한 습득물이 등록되면 다시 알려드릴게요.'}</p></div>}
  </MatchingLayout>;
}

export default function MatchingCandidatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useMatchCandidates(searchParams.get('itemId') ?? undefined);
  const onBack = () => navigate(location.state?.returnTo === '/mypage' ? '/mypage' : '/complete');
  if (isLoading || error) return <MatchingLoadState title="매칭 완료" error={error} onBack={onBack} />;
  return <MatchingCandidatesView data={data} onBack={onBack} navigationState={{ ...location.state, lostItemId: data.lostItem.id }} />;
}
