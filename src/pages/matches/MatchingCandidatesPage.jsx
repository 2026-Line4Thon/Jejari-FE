import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchingLayout, MatchingLoadState, MatchingCandidateCard } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';

function formatDate(value) {
  if (!value) return '등록 일시 정보 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(date);
}

function mapCandidate(candidate) {
  const item = candidate.found_item ?? {};
  const similarityLabel = String(candidate.similarity_label ?? '').toLowerCase();
  return {
    id: candidate.candidate_id,
    name: item.item_name || '습득물',
    similarity: similarityLabel.includes('높') || similarityLabel.includes('high') ? 'high' : 'low',
    attributes: [item.category, item.color].filter(Boolean).join(' · ') || '매칭 정보 확인',
    place: item.place_name || '습득 장소 정보 없음',
    foundAtLabel: formatDate(item.found_at),
    photo: { source: item.image_url || matchingAssets.earbuds },
  };
}

export function MatchingCandidatesView({ data, onBack }) {
  return <MatchingLayout title="매칭 완료" titleId="matching-list-title" onBack={onBack} className="matching-list-page">
    <section className="matching-source" aria-label="내 분실물"><small>내 분실물</small><h2>{data.lostItem.color} {data.lostItem.name}</h2><p>{data.lostItem.place} · {data.lostItem.dateLabel}</p><span className="matching-count">후보 {data.candidates.length}건</span></section>
    <section className="matching-list-intro"><h2><img src={matchingAssets.jejari} alt="" />{data.candidates.length ? 'Jejari가 찾은 유사한 물건이에요' : '비슷한 물건을 계속 찾고 있어요'}</h2><p>유사도뿐 아니라 장소와 시간도 함께 확인해 주세요.</p></section>
    {data.candidates.length ? <div className="matching-candidate-list">{data.candidates.map((candidate) => <MatchingCandidateCard key={candidate.id} candidate={candidate} dateLabel={candidate.foundAtLabel} to={candidatePath(candidate.id)} />)}</div> : <div className="matching-empty" role="status"><h3>새로운 후보를 계속 찾고 있어요.</h3><p>비슷한 습득물이 등록되면 다시 알려드릴게요.</p></div>}
  </MatchingLayout>;
}

export default function MatchingCandidatesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadCandidates = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 매칭 후보를 확인할 수 있어요.');

        const headers = { Authorization: `Bearer ${accessToken}` };
        const itemsResponse = await fetch('https://miseno.store/auth/me/items?type=lost', { headers });
        const items = await itemsResponse.json();
        if (!itemsResponse.ok) throw new Error(items.detail || '내 분실물 목록을 불러오지 못했어요.');

        const lostItem = Array.isArray(items) ? items[0] : null;
        if (!lostItem) throw new Error('등록한 분실물이 없어요.');

        const matchingResponse = await fetch(`https://miseno.store/dev/matching/${lostItem.id}`, {
          method: 'POST',
          headers,
        });
        // 개발 서버가 아니거나 관리자가 아닌 경우에도, 기존 후보 목록은 조회할 수 있어요.
        if (!matchingResponse.ok && ![403, 404].includes(matchingResponse.status)) {
          const matchingData = await matchingResponse.json().catch(() => ({}));
          throw new Error(matchingData.detail || '매칭 실행에 실패했어요.');
        }

        const candidatesResponse = await fetch(`https://miseno.store/items/lost/${lostItem.id}/candidates`, { headers });
        const candidatesData = await candidatesResponse.json();
        if (!candidatesResponse.ok) throw new Error(candidatesData.detail || '매칭 후보 목록을 불러오지 못했어요.');

        if (active) {
          setData({
            lostItem: {
              name: lostItem.item_name || '분실물',
              color: '',
              place: lostItem.status_label || lostItem.status || '등록한 분실물',
              dateLabel: formatDate(lostItem.created_at),
            },
            candidates: (candidatesData.candidates ?? []).map(mapCandidate),
          });
        }
      } catch (loadError) {
        if (active) setError(loadError.message || '매칭 후보 목록을 불러오지 못했어요.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadCandidates();
    return () => { active = false; };
  }, []);

  const onBack = () => navigate('/home');
  if (isLoading || error) return <MatchingLoadState title="매칭 완료" error={error} onBack={onBack} />;
  return <MatchingCandidatesView data={data} onBack={onBack} />;
}
